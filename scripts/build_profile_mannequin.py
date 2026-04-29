import argparse
import bmesh
import importlib.util
import math
import os
import subprocess
import sys
from pathlib import Path

import bpy
from mathutils import Euler, Vector


SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTER_ROOT = PROJECT_ROOT.parent


def parse_args():
    argv = sys.argv
    if "--" in argv:
        argv = argv[argv.index("--") + 1 :]
    else:
        argv = []

    parser = argparse.ArgumentParser(description="Build stylized 3D profile mannequin variants.")
    parser.add_argument("--output-glb", required=True)
    parser.add_argument("--output-poster", required=True)
    parser.add_argument("--resolution", type=int, default=1440)
    parser.add_argument("--variant", choices=["base", "leather"], default="base")
    return parser.parse_args(argv)


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    if hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = 48
    if hasattr(scene.eevee, "use_gtao"):
        scene.eevee.use_gtao = True
    if hasattr(scene.eevee, "gtao_factor"):
        scene.eevee.gtao_factor = 1.6
    if hasattr(scene.eevee, "use_bloom"):
        scene.eevee.use_bloom = True
    if hasattr(scene.eevee, "bloom_intensity"):
        scene.eevee.bloom_intensity = 0.028
    return scene


def _set_socket(node_inputs, socket_name, value):
    socket = node_inputs.get(socket_name)
    if socket is not None:
        socket.default_value = value


def make_material(name, base_color, metallic=0.0, roughness=0.5, specular=0.5):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = max(roughness, 0.82)
    bsdf.inputs["Specular IOR Level"].default_value = min(specular, 0.12)
    _set_socket(bsdf.inputs, "Emission Color", (*[min(1.0, channel * 0.24) for channel in base_color], 1.0))
    _set_socket(bsdf.inputs, "Emission Strength", 0.04)
    return mat


def make_image_material(
    name,
    image_path: Path,
    metallic=0.0,
    roughness=0.6,
    specular=0.3,
    alpha_mode: str | None = None,
):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    tex = nodes.new("ShaderNodeTexImage")
    tex.image = bpy.data.images.load(str(image_path), check_existing=True)
    if tex.image:
        try:
            tex.image.colorspace_settings.name = "sRGB"
        except Exception:
            pass
        try:
            tex.image.alpha_mode = "CHANNEL_PACKED" if alpha_mode else "NONE"
        except Exception:
            pass
    tex.interpolation = "Linear"
    tex.extension = "CLIP"
    tex.location = (-320, 260)
    links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    emission_color = bsdf.inputs.get("Emission Color")
    if emission_color is not None:
        links.new(tex.outputs["Color"], emission_color)
    if hasattr(mat, "blend_method"):
        mat.blend_method = "OPAQUE"
    if hasattr(mat, "shadow_method"):
        mat.shadow_method = "OPAQUE"
    if alpha_mode:
        links.new(tex.outputs["Alpha"], bsdf.inputs["Alpha"])
        if hasattr(mat, "blend_method"):
            mat.blend_method = alpha_mode
        if hasattr(mat, "shadow_method"):
            mat.shadow_method = alpha_mode
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = max(roughness, 0.8)
    bsdf.inputs["Specular IOR Level"].default_value = min(specular, 0.12)
    _set_socket(bsdf.inputs, "Emission Strength", 0.03)
    return mat


def finalize_object(obj, material=None, smooth=True):
    if material:
        obj.data.materials.clear()
        obj.data.materials.append(material)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    if smooth:
        try:
            bpy.ops.object.shade_smooth()
        except Exception:
            pass
    obj.select_set(False)
    return obj


def primitive_cube(location, scale, material=None):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finalize_object(obj, material)


def primitive_uv_sphere(location, radius, material=None, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(
        location=location,
        radius=radius,
        segments=segments,
        ring_count=rings,
    )
    obj = bpy.context.object
    return finalize_object(obj, material)


def primitive_scaled_sphere(location, scale, material=None, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(
        location=location,
        radius=1.0,
        segments=segments,
        ring_count=rings,
    )
    obj = bpy.context.object
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finalize_object(obj, material)


def primitive_cylinder_between(start, end, radius, material=None, vertices=24):
    start_v = Vector(start)
    end_v = Vector(end)
    delta = end_v - start_v
    depth = delta.length
    midpoint = start_v + delta * 0.5
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=midpoint,
    )
    obj = bpy.context.object
    obj.rotation_mode = "QUATERNION"
    obj.rotation_quaternion = Vector((0, 0, 1)).rotation_difference(delta.normalized())
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=False)
    return finalize_object(obj, material)


def find_l2_mfighter_root() -> Path | None:
    candidates = [
        OUTER_ROOT / "_l2_mfighter_gltf" / "Fighter" / "SkeletalMesh",
        OUTER_ROOT / "_l2_mesh_probe_materials" / "Fighter" / "SkeletalMesh",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def find_l2_mfighter_clean_root() -> Path | None:
    candidates = [
        OUTER_ROOT / "$out" / "Fighter" / "SkeletalMesh",
        OUTER_ROOT / "_l2_clear_mfighter_m000" / "Fighter" / "SkeletalMesh",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def find_first_existing(*paths: Path) -> Path | None:
    for path in paths:
        if path.exists():
            return path
    return None


def resolve_l2_texture_sets():
    leather_root = find_first_existing(
        OUTER_ROOT / "_l2_extract_t04" / "FFighter" / "Texture",
        OUTER_ROOT / "_l2_leather_probe" / "FFighter" / "Texture",
    )
    head_root = find_first_existing(
        OUTER_ROOT / "_l2_leather_head_probe" / "FFighter" / "Texture",
        OUTER_ROOT / "_l2_extract_test2" / "FFighter" / "Texture",
    )
    return leather_root, head_root


def find_l2_game_root() -> Path | None:
    candidates = [
        Path("E:/l2 clear"),
        Path("E:/GamePirate/MASTERWORK"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def find_umodel_materials_exe() -> Path | None:
    candidates = [
        OUTER_ROOT / "tools" / "umodel_materials" / "umodel_materials.exe",
        OUTER_ROOT / "tools" / "umodel.exe",
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def ensure_profile_animation_exports(variant: str) -> dict[str, Path] | None:
    game_root = find_l2_game_root()
    umodel = find_umodel_materials_exe()
    if not game_root or not umodel:
        return None

    export_root = PROJECT_ROOT / "_profile_anim_src"
    export_root.mkdir(parents=True, exist_ok=True)

    variant_parts = {
        "base": [
            "MFighter_m000_u",
            "MFighter_m000_l",
            "MFighter_m000_g",
            "MFighter_m000_b",
            "MFighter_m000_h",
            "MFighter_m000_f",
        ],
        "leather": [
            "MFighter_m001_u",
            "MFighter_m001_l",
            "MFighter_m001_g",
            "MFighter_m001_b",
            "MFighter_m000_h",
            "MFighter_m000_f",
        ],
    }

    def run_export(object_name: str, export_anims: bool = False) -> None:
        cmd = [
            str(umodel),
            f"-path={game_root}",
            f"-out={export_root}",
            "-export",
        ]
        if export_anims:
            cmd.append("-anims")
        cmd.extend(["Fighter", object_name])
        subprocess.run(cmd, check=True)

    part_paths: dict[str, Path] = {}
    for object_name in variant_parts[variant]:
        psk_path = export_root / "Fighter" / "SkeletalMesh" / f"{object_name}.psk"
        if not psk_path.exists():
            run_export(object_name, export_anims=False)
        if not psk_path.exists():
            return None
        part_paths[object_name] = psk_path

    psa_path = export_root / "Fighter" / "MeshAnimation" / "MFighter_anim.psa"
    if not psa_path.exists():
        run_export("MFighter_anim", export_anims=True)
    if not psa_path.exists():
        return None

    part_paths["MFighter_anim"] = psa_path
    part_paths["texture_root"] = export_root / "MFighter" / "Texture"
    return part_paths


def load_pskpsa_importer():
    addon_path = (
        Path(os.environ.get("APPDATA", ""))
        / "Blender Foundation"
        / "Blender"
        / "5.1"
        / "scripts"
        / "addons"
        / "umodel_tools-main"
        / "umodel_tools"
        / "third_party"
        / "io_import_scene_unreal_psa_psk_280.py"
    )
    if not addon_path.exists():
        return None, None

    source = addon_path.read_text(encoding="utf-8")

    if "mesh_data.use_auto_smooth = True" in source and "if hasattr(mesh_data, 'use_auto_smooth')" not in source:
        source = source.replace(
            "            mesh_data.use_auto_smooth = True",
            "            if hasattr(mesh_data, 'use_auto_smooth'):\n                mesh_data.use_auto_smooth = True",
        )

    if "armature_obj.pose.bone_groups.new" in source and "bone_group_unused = None" not in source:
        source = source.replace(
            "        bone_group_unused = armature_obj.pose.bone_groups.new(name = \"Unused bones\")\n"
            "        bone_group_unused.color_set = 'THEME14'\n\n"
            "        bone_group_nochild = armature_obj.pose.bone_groups.new(name = \"No children\")\n"
            "        bone_group_nochild.color_set = 'THEME03'\n\n"
            "        armature_data.show_group_colors = True\n",
            "        bone_group_unused = None\n"
            "        bone_group_nochild = None\n"
            "        if hasattr(armature_obj.pose, 'bone_groups'):\n"
            "            bone_group_unused = armature_obj.pose.bone_groups.new(name = \"Unused bones\")\n"
            "            bone_group_unused.color_set = 'THEME14'\n"
            "            bone_group_nochild = armature_obj.pose.bone_groups.new(name = \"No children\")\n"
            "            bone_group_nochild.color_set = 'THEME03'\n"
            "            if hasattr(armature_data, 'show_group_colors'):\n"
            "                armature_data.show_group_colors = True\n",
        )

    if "if bone_group_nochild is not None:\n                        pose_bone.bone_group = bone_group_nochild" not in source:
        source = source.replace(
            "                    pose_bone.bone_group = bone_group_nochild",
            "                    if bone_group_nochild is not None:\n                        pose_bone.bone_group = bone_group_nochild",
        )
    if "if bone_group_unused is not None:\n                    pose_bone.bone_group = bone_group_unused" not in source:
        source = source.replace(
            "                pose_bone.bone_group = bone_group_unused",
            "                if bone_group_unused is not None:\n                    pose_bone.bone_group = bone_group_unused",
        )

    if "armature_obj.animation_data.action = action" not in source:
        source = source.replace(
            "        action = bpy.data.actions.new(name = Name)\n",
            "        action = bpy.data.actions.new(name = Name)\n        armature_obj.animation_data.action = action\n",
        )

    source = source.replace(
        "action.fcurves.new(data_path, index = 0)",
        "action.fcurve_ensure_for_datablock(armature_obj, data_path, index = 0)",
    )
    source = source.replace(
        "action.fcurves.new(data_path, index = 1)",
        "action.fcurve_ensure_for_datablock(armature_obj, data_path, index = 1)",
    )
    source = source.replace(
        "action.fcurves.new(data_path, index = 2)",
        "action.fcurve_ensure_for_datablock(armature_obj, data_path, index = 2)",
    )
    source = source.replace(
        "action.fcurves.new(data_path, index = 3)",
        "action.fcurve_ensure_for_datablock(armature_obj, data_path, index = 3)",
    )

    if "if psa_bone is None:" not in source:
        source = source.replace(
            "                psa_bone = PsaBonesToProcess[j]\n                # pose_bone = psa_bone.pose_bone\n",
            "                psa_bone = PsaBonesToProcess[j]\n"
            "                if psa_bone is None:\n"
            "                    raw_key_index += 1\n"
            "                    continue\n"
            "                # pose_bone = psa_bone.pose_bone\n",
        )

    module = importlib.util.module_from_spec(importlib.util.spec_from_loader("pskpsa_compat", loader=None))
    exec(compile(source, str(addon_path), "exec"), module.__dict__)
    return module.pskimport, module.psaimport


def bind_mesh_to_armature(mesh_obj, armature_obj):
    mesh_obj.parent = armature_obj
    mesh_obj.parent_type = "OBJECT"
    modifier = mesh_obj.modifiers.new(armature_obj.data.name, type="ARMATURE")
    modifier.show_expanded = False
    modifier.use_vertex_groups = True
    modifier.use_bone_envelopes = False
    modifier.object = armature_obj


def import_psk_part(pskimport, filepath: Path, with_bones: bool, armature_obj=None):
    before = set(bpy.data.objects)
    if armature_obj is not None:
        for obj in bpy.data.objects:
            obj.select_set(False)
        armature_obj.select_set(True)
        bpy.context.view_layer.objects.active = armature_obj

    pskimport(
        str(filepath),
        context=bpy.context,
        bImportmesh=True,
        bImportbone=with_bones,
    )
    imported = [obj for obj in bpy.data.objects if obj not in before]
    meshes = [obj for obj in imported if obj.type == "MESH"]
    armatures = [obj for obj in imported if obj.type == "ARMATURE"]

    if with_bones:
        return armatures[0] if armatures else None, meshes

    for mesh in meshes:
        bind_mesh_to_armature(mesh, armature_obj)
    return armature_obj, meshes


def apply_material(meshes, material):
    for obj in meshes:
        obj.data.materials.clear()
        obj.data.materials.append(material)
        finalize_object(obj, smooth=True)


def join_mesh_objects(meshes):
    targets = [obj for obj in meshes if obj and obj.type == "MESH"]
    if len(targets) < 2:
        return targets[0] if targets else None
    for obj in bpy.data.objects:
        obj.select_set(False)
    active = targets[0]
    for obj in targets:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = active
    bpy.ops.object.join()
    result = bpy.context.view_layer.objects.active
    finalize_object(result, smooth=True)
    return result


def offset_meshes(meshes, *, x=0.0, y=0.0, z=0.0):
    if not meshes:
        return
    delta = Vector((x, y, z))
    for obj in meshes:
        obj.location += delta
    bpy.context.view_layer.update()


def retime_action(action, factor=1.0, anchor_frame=1.0):
    if not action or factor == 1.0:
        return
    channelbags = []
    if hasattr(action, "layers") and action.layers:
        for layer in action.layers:
            strips = getattr(layer, "strips", None)
            if not strips:
                continue
            for strip in strips:
                bags = getattr(strip, "channelbags", None)
                if bags:
                    channelbags.extend(list(bags))
    elif hasattr(action, "fcurves"):
        channelbags = [action]

    for channelbag in channelbags:
        fcurves = getattr(channelbag, "fcurves", None)
        if not fcurves:
            continue
        for fcurve in fcurves:
            for keyframe in fcurve.keyframe_points:
                keyframe.co.x = anchor_frame + (keyframe.co.x - anchor_frame) * factor
                keyframe.handle_left.x = anchor_frame + (keyframe.handle_left.x - anchor_frame) * factor
                keyframe.handle_right.x = anchor_frame + (keyframe.handle_right.x - anchor_frame) * factor


def strip_deformed_spike_faces(
    meshes,
    length_threshold=0.08,
    aspect_ratio_threshold=20.0,
    area_threshold=0.0005,
    max_component_vertices=2,
):
    depsgraph = bpy.context.evaluated_depsgraph_get()
    for obj in meshes:
        if not obj or obj.type != "MESH":
            continue
        eval_obj = obj.evaluated_get(depsgraph)
        eval_mesh = eval_obj.to_mesh()
        long_edge_indices = set()
        target_face_indices = set()
        for edge_index, edge in enumerate(eval_mesh.edges):
            v1 = eval_mesh.vertices[edge.vertices[0]].co
            v2 = eval_mesh.vertices[edge.vertices[1]].co
            if (v1 - v2).length > length_threshold:
                long_edge_indices.add(edge_index)
        for polygon in eval_mesh.polygons:
            vertices = [eval_mesh.vertices[index].co for index in polygon.vertices]
            edge_lengths = []
            for index in range(len(vertices)):
                edge_lengths.append((vertices[index] - vertices[(index + 1) % len(vertices)]).length)
            max_edge = max(edge_lengths)
            min_edge = max(1e-6, min(edge_lengths))
            if (max_edge / min_edge) > aspect_ratio_threshold and polygon.area < area_threshold:
                target_face_indices.add(polygon.index)
        eval_obj.to_mesh_clear()

        if not long_edge_indices and not target_face_indices:
            continue

        mesh_data = obj.data
        bm = bmesh.new()
        bm.from_mesh(mesh_data)
        bm.verts.ensure_lookup_table()
        bm.edges.ensure_lookup_table()
        bm.faces.ensure_lookup_table()

        target_faces = set()
        for edge_index in long_edge_indices:
            if edge_index < len(bm.edges):
                for face in bm.edges[edge_index].link_faces:
                    target_faces.add(face)
        for face_index in target_face_indices:
            if face_index < len(bm.faces):
                target_faces.add(bm.faces[face_index])
        expanded_faces = set(target_faces)
        for face in list(target_faces):
            for vert in face.verts:
                for linked_face in vert.link_faces:
                    expanded_faces.add(linked_face)
        target_faces = expanded_faces
        if target_faces:
            bmesh.ops.delete(bm, geom=list(target_faces), context="FACES")

        bm.verts.ensure_lookup_table()
        pending = set(v.index for v in bm.verts)
        tiny_components = []
        while pending:
            start_index = next(iter(pending))
            stack = [bm.verts[start_index]]
            component = []
            while stack:
                vert = stack.pop()
                if vert.index not in pending:
                    continue
                pending.remove(vert.index)
                component.append(vert)
                for edge in vert.link_edges:
                    other = edge.other_vert(vert)
                    if other.index in pending:
                        stack.append(other)
            if len(component) <= max_component_vertices:
                tiny_components.extend(component)

        orphan_verts = [vert for vert in bm.verts if not vert.link_faces]
        delete_verts = list({*tiny_components, *orphan_verts})
        if delete_verts:
            bmesh.ops.delete(bm, geom=delete_verts, context="VERTS")

        bm.to_mesh(mesh_data)
        bm.free()
        mesh_data.update()


def add_l2_fighter_profile_animated(variant: str) -> bool:
    exported = ensure_profile_animation_exports(variant)
    if not exported:
        return False

    pskimport, psaimport = load_pskpsa_importer()
    if not pskimport or not psaimport:
        return False

    texture_root = exported["texture_root"]
    armature_obj = None

    if variant == "leather":
        upper_tex = find_first_existing(texture_root / "MFighter_m001_t01_u_sp_rgb.png", texture_root / "MFighter_m001_t01_u_sp.png", texture_root / "MFighter_m001_t01_u_sp.tga")
        lower_tex = find_first_existing(texture_root / "MFighter_m001_t01_l_sp_rgb.png", texture_root / "MFighter_m001_t01_l_sp.png", texture_root / "MFighter_m001_t01_l_sp.tga")
        gloves_tex = find_first_existing(texture_root / "MFighter_m001_t01_g_sp_rgb.png", texture_root / "MFighter_m001_t01_g_sp.png", texture_root / "MFighter_m001_t01_g_sp.tga")
        boots_tex = find_first_existing(texture_root / "MFighter_m001_t01_b_sp_rgb.png", texture_root / "MFighter_m001_t01_b_sp.png", texture_root / "MFighter_m001_t01_b_sp.tga")
        upper_mat = make_image_material("AnimLeatherUpper", upper_tex, metallic=0.02, roughness=0.78, specular=0.18) if upper_tex else make_material("AnimLeatherUpperFallback", (0.43, 0.31, 0.20), metallic=0.10, roughness=0.66, specular=0.24)
        lower_mat = make_image_material("AnimLeatherLower", lower_tex, metallic=0.02, roughness=0.80, specular=0.16) if lower_tex else make_material("AnimLeatherLowerFallback", (0.47, 0.34, 0.22), metallic=0.10, roughness=0.68, specular=0.24)
        gloves_mat = make_image_material("AnimLeatherGloves", gloves_tex, metallic=0.02, roughness=0.80, specular=0.16) if gloves_tex else make_material("AnimLeatherGlovesFallback", (0.37, 0.27, 0.18), metallic=0.08, roughness=0.70, specular=0.22)
        boots_mat = make_image_material("AnimLeatherBoots", boots_tex, metallic=0.02, roughness=0.82, specular=0.14) if boots_tex else make_material("AnimLeatherBootsFallback", (0.29, 0.21, 0.14), metallic=0.08, roughness=0.72, specular=0.22)

        armature_obj, upper_meshes = import_psk_part(pskimport, exported["MFighter_m001_u"], with_bones=True)
        _, lower_meshes = import_psk_part(pskimport, exported["MFighter_m001_l"], with_bones=False, armature_obj=armature_obj)
        _, gloves_meshes = import_psk_part(pskimport, exported["MFighter_m001_g"], with_bones=False, armature_obj=armature_obj)
        _, boots_meshes = import_psk_part(pskimport, exported["MFighter_m001_b"], with_bones=False, armature_obj=armature_obj)
        apply_material(upper_meshes, upper_mat)
        apply_material(lower_meshes, lower_mat)
        apply_material(gloves_meshes, gloves_mat)
        apply_material(boots_meshes, boots_mat)
    else:
        upper_tex = find_first_existing(texture_root / "MFighter_m000_t01_u_sp_rgb.png", texture_root / "MFighter_m000_t01_u_sp.png", texture_root / "MFighter_m000_t01_u_sp.tga")
        lower_tex = find_first_existing(texture_root / "MFighter_m000_t01_l_sp_rgb.png", texture_root / "MFighter_m000_t01_l_sp.png", texture_root / "MFighter_m000_t01_l_sp.tga")
        gloves_tex = find_first_existing(texture_root / "MFighter_m000_t01_g_sp_rgb.png", texture_root / "MFighter_m000_t01_g_sp.png", texture_root / "MFighter_m000_t01_g_sp.tga")
        boots_tex = find_first_existing(texture_root / "MFighter_m000_t01_b_sp_rgb.png", texture_root / "MFighter_m000_t01_b_sp.png", texture_root / "MFighter_m000_t01_b_sp.tga")
        upper_mat = make_image_material("AnimBaseUpper", upper_tex, metallic=0.02, roughness=0.82, specular=0.12) if upper_tex else make_material("AnimBaseUpperFallback", (0.42, 0.42, 0.46), metallic=0.02, roughness=0.86, specular=0.08)
        lower_mat = make_image_material("AnimBaseLower", lower_tex, metallic=0.02, roughness=0.84, specular=0.10) if lower_tex else make_material("AnimBaseLowerFallback", (0.30, 0.27, 0.24), metallic=0.02, roughness=0.88, specular=0.08)
        gloves_mat = make_image_material("AnimBaseGloves", gloves_tex, metallic=0.02, roughness=0.80, specular=0.12) if gloves_tex else make_material("AnimBaseHandsFallback", (0.50, 0.43, 0.35), metallic=0.0, roughness=0.72, specular=0.14)
        boots_mat = make_image_material("AnimBaseBoots", boots_tex, metallic=0.02, roughness=0.82, specular=0.10) if boots_tex else make_material("AnimBaseBootsFallback", (0.24, 0.22, 0.20), metallic=0.02, roughness=0.86, specular=0.08)

        armature_obj, upper_meshes = import_psk_part(pskimport, exported["MFighter_m000_u"], with_bones=True)
        _, lower_meshes = import_psk_part(pskimport, exported["MFighter_m000_l"], with_bones=False, armature_obj=armature_obj)
        _, gloves_meshes = import_psk_part(pskimport, exported["MFighter_m000_g"], with_bones=False, armature_obj=armature_obj)
        _, boots_meshes = import_psk_part(pskimport, exported["MFighter_m000_b"], with_bones=False, armature_obj=armature_obj)
        apply_material(upper_meshes, upper_mat)
        apply_material(lower_meshes, lower_mat)
        apply_material(gloves_meshes, gloves_mat)
        apply_material(boots_meshes, boots_mat)

    face_tex = find_first_existing(
        texture_root / "MFighter_m000_t01_f.png",
        texture_root / "MFighter_m000_t01_f.tga",
    )
    face_mat = make_image_material("AnimFace", face_tex, metallic=0.0, roughness=0.68, specular=0.16) if face_tex else make_material("AnimFaceFallback", (0.74, 0.62, 0.50), metallic=0.0, roughness=0.68, specular=0.16)
    hair_mat = make_material("AnimHair", (0.57, 0.46, 0.25), metallic=0.0, roughness=0.86, specular=0.08)

    _, hair_head_meshes = import_psk_part(pskimport, exported["MFighter_m000_h"], with_bones=False, armature_obj=armature_obj)
    _, face_meshes = import_psk_part(pskimport, exported["MFighter_m000_f"], with_bones=False, armature_obj=armature_obj)
    apply_material(hair_head_meshes, hair_mat)
    apply_material(face_meshes, face_mat)
    # The standalone face mesh sits a bit too low versus the animated
    # head/hair shell in the original exports. Keep its natural forward depth
    # and only lift it slightly so it doesn't sink into the face plate.
    offset_meshes(face_meshes, y=0.0, z=0.011)
    join_mesh_objects([*hair_head_meshes, *face_meshes])
    add_imported_fighter_hair(hair_mat)

    psaimport(str(exported["MFighter_anim"]), context=bpy.context, oArmature=armature_obj)
    stand_action = bpy.data.actions.get("Stand_MFighter")
    idle_action = (
        bpy.data.actions.get("Wait_Hand_MFighter")
        or bpy.data.actions.get("Wait_1HS_MFighter")
        or bpy.data.actions.get("Wait_Shield_MFighter")
        or stand_action
    )
    if not stand_action and not idle_action:
        return False

    if idle_action and idle_action is not stand_action:
        retime_action(idle_action, factor=1.75)

    keep_actions = {action for action in (stand_action, idle_action) if action is not None}
    for action in list(bpy.data.actions):
        if action not in keep_actions:
            bpy.data.actions.remove(action)

    armature_obj.animation_data.action = idle_action or stand_action
    bpy.context.scene.frame_start = 1
    bpy.context.scene.frame_end = max(
        2,
        int(round(max(action.frame_range[1] for action in keep_actions))),
    )
    bpy.context.scene.frame_set(1)
    strip_deformed_spike_faces(gloves_meshes, length_threshold=0.08, max_component_vertices=2)
    return True


def import_l2_profile_part(gltf_path: Path, material):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=str(gltf_path))
    imported = [obj for obj in bpy.data.objects if obj not in before]
    for obj in imported:
        if obj.type == "MESH":
            obj.data.materials.clear()
            obj.data.materials.append(material)
            finalize_object(obj, smooth=True)
        elif obj.type == "ARMATURE" or obj.name.startswith("Icosphere"):
            obj.hide_render = True
            obj.hide_viewport = True
    return imported


def add_l2_fighter_profile(variant: str) -> bool:
    clean_root = find_l2_mfighter_clean_root()
    if variant == "base":
        if clean_root:
            required_clean = [
                clean_root / "MFighter_m000_u.gltf",
                clean_root / "MFighter_m000_l.gltf",
                clean_root / "MFighter_m000_g.gltf",
                clean_root / "MFighter_m000_b.gltf",
                clean_root / "MFighter_m000_h.gltf",
                clean_root / "MFighter_m000_f.gltf",
            ]
            if all(path.exists() for path in required_clean):
                face_tex = find_first_existing(
                    OUTER_ROOT / "$out" / "MFighter" / "Texture" / "MFighter_m000_t01_f.png",
                    OUTER_ROOT / "$out" / "MFighter" / "Texture" / "MFighter_m000_t01_f.tga",
                )
                hair_tex = find_first_existing(
                    OUTER_ROOT / "$out" / "FFighter" / "Texture" / "FFighter_m000_t00_m00_bh_ori.png",
                    OUTER_ROOT / "$out" / "FFighter" / "Texture" / "FFighter_m000_t00_m00_bh_ori.tga",
                )

                upper_mat = make_material("L2CleanUpper", (0.42, 0.42, 0.46), metallic=0.02, roughness=0.86, specular=0.08)
                lower_mat = make_material("L2CleanLower", (0.30, 0.27, 0.24), metallic=0.02, roughness=0.88, specular=0.08)
                hands_mat = make_material("L2CleanHands", (0.50, 0.43, 0.35), metallic=0.0, roughness=0.72, specular=0.14)
                boots_mat = make_material("L2CleanBoots", (0.24, 0.22, 0.20), metallic=0.02, roughness=0.86, specular=0.08)
                hair_mat = make_material("L2CleanHair", (0.58, 0.47, 0.26), metallic=0.0, roughness=0.84, specular=0.08)
                face_mat = make_image_material("L2CleanFaceTex", face_tex, metallic=0.0, roughness=0.68, specular=0.16) if face_tex and face_tex.exists() else make_material("L2CleanFace", (0.74, 0.62, 0.50), metallic=0.0, roughness=0.68, specular=0.16)

                import_l2_profile_part(clean_root / "MFighter_m000_u.gltf", upper_mat)
                import_l2_profile_part(clean_root / "MFighter_m000_l.gltf", lower_mat)
                import_l2_profile_part(clean_root / "MFighter_m000_g.gltf", hands_mat)
                import_l2_profile_part(clean_root / "MFighter_m000_b.gltf", boots_mat)
                import_l2_profile_part(clean_root / "MFighter_m000_h.gltf", hair_mat)
                import_l2_profile_part(clean_root / "MFighter_m000_f.gltf", face_mat)
                add_imported_fighter_hair(
                    make_material(
                        "L2CleanHairShell",
                        (0.57, 0.46, 0.25),
                        metallic=0.0,
                        roughness=0.86,
                        specular=0.08,
                    )
                )
                return True
    elif variant == "leather" and clean_root:
        required_leather_clean = [
            clean_root / "MFighter_m001_u.gltf",
            clean_root / "MFighter_m001_l.gltf",
            clean_root / "MFighter_m001_g.gltf",
            clean_root / "MFighter_m001_b.gltf",
            clean_root / "MFighter_m000_h.gltf",
            clean_root / "MFighter_m000_f.gltf",
        ]
        if all(path.exists() for path in required_leather_clean):
            tex_root = OUTER_ROOT / "$out" / "MFighter" / "Texture"
            armor_u_tex = find_first_existing(tex_root / "MFighter_m001_t01_u_sp_rgb.png", tex_root / "MFighter_m001_t01_u_sp.png", tex_root / "MFighter_m001_t01_u_sp.tga")
            armor_l_tex = find_first_existing(tex_root / "MFighter_m001_t01_l_sp_rgb.png", tex_root / "MFighter_m001_t01_l_sp.png", tex_root / "MFighter_m001_t01_l_sp.tga")
            armor_g_tex = find_first_existing(tex_root / "MFighter_m001_t01_g_sp_rgb.png", tex_root / "MFighter_m001_t01_g_sp.png", tex_root / "MFighter_m001_t01_g_sp.tga")
            armor_b_tex = find_first_existing(tex_root / "MFighter_m001_t01_b_sp_rgb.png", tex_root / "MFighter_m001_t01_b_sp.png", tex_root / "MFighter_m001_t01_b_sp.tga")
            face_tex = find_first_existing(
                tex_root / "MFighter_m000_t01_f.png",
                tex_root / "MFighter_m000_t01_f.tga",
            )
            hair_tex = find_first_existing(
                OUTER_ROOT / "$out" / "FFighter" / "Texture" / "FFighter_m000_t00_m00_bh_ori.png",
                OUTER_ROOT / "$out" / "FFighter" / "Texture" / "FFighter_m000_t00_m00_bh_ori.tga",
            )

            armor_mat = make_image_material("L2LeatherM001U", armor_u_tex, metallic=0.02, roughness=0.78, specular=0.18) if armor_u_tex else make_material("L2LeatherM001UFallback", (0.43, 0.31, 0.20), metallic=0.10, roughness=0.66, specular=0.24)
            legs_mat = make_image_material("L2LeatherM001L", armor_l_tex, metallic=0.02, roughness=0.80, specular=0.16) if armor_l_tex else make_material("L2LeatherM001LFallback", (0.47, 0.34, 0.22), metallic=0.10, roughness=0.68, specular=0.24)
            gloves_mat = make_image_material("L2LeatherM001G", armor_g_tex, metallic=0.02, roughness=0.80, specular=0.16) if armor_g_tex else make_material("L2LeatherM001GFallback", (0.37, 0.27, 0.18), metallic=0.08, roughness=0.70, specular=0.22)
            boots_mat = make_image_material("L2LeatherM001B", armor_b_tex, metallic=0.02, roughness=0.82, specular=0.14) if armor_b_tex else make_material("L2LeatherM001BFallback", (0.29, 0.21, 0.14), metallic=0.08, roughness=0.72, specular=0.22)
            hair_mat = make_material("L2LeatherHair", (0.58, 0.47, 0.26), metallic=0.0, roughness=0.84, specular=0.08)
            face_mat = make_image_material("L2LeatherFaceTex", face_tex, metallic=0.0, roughness=0.68, specular=0.16) if face_tex and face_tex.exists() else make_material("L2LeatherFace", (0.72, 0.60, 0.48), metallic=0.0, roughness=0.58, specular=0.28)

            import_l2_profile_part(clean_root / "MFighter_m001_u.gltf", armor_mat)
            import_l2_profile_part(clean_root / "MFighter_m001_l.gltf", legs_mat)
            import_l2_profile_part(clean_root / "MFighter_m001_g.gltf", gloves_mat)
            import_l2_profile_part(clean_root / "MFighter_m001_b.gltf", boots_mat)
            import_l2_profile_part(clean_root / "MFighter_m000_h.gltf", hair_mat)
            import_l2_profile_part(clean_root / "MFighter_m000_f.gltf", face_mat)
            add_imported_fighter_hair(
                make_material(
                    "L2LeatherHairShell",
                    (0.57, 0.46, 0.25),
                    metallic=0.0,
                    roughness=0.86,
                    specular=0.08,
                )
            )
            return True

    root = find_l2_mfighter_root()
    if not root:
        return False

    required = [
        root / "MFighter_m004_u.gltf",
        root / "MFighter_m004_l.gltf",
        root / "MFighter_m004_g.gltf",
        root / "MFighter_m004_b.gltf",
        root / "MFighter_m004_m00_bh.gltf",
        root / "MFighter_m004_m00_ah.gltf",
    ]
    if not all(path.exists() for path in required):
        return False

    leather_root, head_root = resolve_l2_texture_sets()

    armor_u_tex = leather_root / "FFighter_m001_t04_u.png" if leather_root else None
    armor_l_tex = leather_root / "FFighter_m001_t04_l.png" if leather_root else None
    armor_g_tex = leather_root / "FFighter_m001_t04_g.png" if leather_root else None
    armor_b_tex = (leather_root / "FFighter_m001_t03_b.png") if leather_root and (leather_root / "FFighter_m001_t03_b.png").exists() else (leather_root / "FFighter_m001_t04_b_sp.png" if leather_root else None)
    skin_tex = head_root / "FFighter_m001_t03_m00_bh_ori.png" if head_root and (head_root / "FFighter_m001_t03_m00_bh_ori.png").exists() else None
    hair_tex = head_root / "FFighter_m001_t03_m00_ah_ori.png" if head_root and (head_root / "FFighter_m001_t03_m00_ah_ori.png").exists() else None

    if variant == "leather" and armor_u_tex and armor_u_tex.exists():
        armor_mat = make_image_material("L2ArmorLeatherTex", armor_u_tex, metallic=0.02, roughness=0.78, specular=0.18)
        legs_mat = make_image_material("L2LegsLeatherTex", armor_l_tex, metallic=0.02, roughness=0.80, specular=0.16) if armor_l_tex and armor_l_tex.exists() else make_material("L2LegsLeather", (0.47, 0.34, 0.22), metallic=0.10, roughness=0.68, specular=0.24)
        gloves_mat = make_image_material("L2GlovesLeatherTex", armor_g_tex, metallic=0.02, roughness=0.80, specular=0.16) if armor_g_tex and armor_g_tex.exists() else make_material("L2GlovesLeather", (0.37, 0.27, 0.18), metallic=0.08, roughness=0.70, specular=0.22)
        boots_mat = make_image_material("L2BootsLeatherTex", armor_b_tex, metallic=0.02, roughness=0.82, specular=0.14) if armor_b_tex and armor_b_tex.exists() else make_material("L2BootsLeather", (0.29, 0.21, 0.14), metallic=0.08, roughness=0.72, specular=0.22)
    else:
        armor_mat = make_material("L2ArmorBase", (0.56, 0.57, 0.62), metallic=0.14, roughness=0.66, specular=0.18)
        legs_mat = make_material("L2LegsBase", (0.50, 0.51, 0.57), metallic=0.14, roughness=0.68, specular=0.16)
        gloves_mat = make_material("L2GlovesBase", (0.45, 0.46, 0.52), metallic=0.14, roughness=0.70, specular=0.15)
        boots_mat = make_material("L2BootsBase", (0.38, 0.39, 0.45), metallic=0.14, roughness=0.72, specular=0.14)

    skin_mat = make_image_material("L2SkinTex", skin_tex, metallic=0.0, roughness=0.68, specular=0.18) if skin_tex and skin_tex.exists() else make_material("L2Skin", (0.72, 0.60, 0.48), metallic=0.0, roughness=0.58, specular=0.28)
    hair_mat = make_image_material("L2HairTex", hair_tex, metallic=0.0, roughness=0.84, specular=0.08, alpha_mode="HASHED") if hair_tex and hair_tex.exists() else make_material("L2Hair", (0.35, 0.26, 0.16), metallic=0.02, roughness=0.76, specular=0.12)

    import_l2_profile_part(root / "MFighter_m004_u.gltf", armor_mat)
    import_l2_profile_part(root / "MFighter_m004_l.gltf", legs_mat)
    import_l2_profile_part(root / "MFighter_m004_g.gltf", gloves_mat)
    import_l2_profile_part(root / "MFighter_m004_b.gltf", boots_mat)
    import_l2_profile_part(root / "MFighter_m004_m00_bh.gltf", skin_mat)
    import_l2_profile_part(root / "MFighter_m004_m00_ah.gltf", hair_mat)
    return True


def add_hair(hair_mat):
    primitive_scaled_sphere((0.0, 0.015, 2.14), (0.17, 0.17, 0.16), hair_mat)
    primitive_cube((0.0, -0.03, 1.985), (0.17, 0.05, 0.032), hair_mat)
    primitive_cube((-0.118, -0.006, 2.03), (0.032, 0.026, 0.12), hair_mat)
    primitive_cube((0.118, -0.006, 2.03), (0.032, 0.026, 0.12), hair_mat)


def add_imported_fighter_hair(hair_mat):
    primitive_scaled_sphere((0.0, 0.0, 1.91), (0.17, 0.175, 0.145), hair_mat)
    primitive_scaled_sphere((0.0, -0.036, 1.84), (0.175, 0.10, 0.152), hair_mat)
    primitive_cube((0.0, 0.03, 1.95), (0.09, 0.04, 0.045), hair_mat)
    primitive_cube((0.0, -0.086, 1.73), (0.126, 0.05, 0.12), hair_mat)
    primitive_cube((-0.114, -0.026, 1.77), (0.034, 0.036, 0.18), hair_mat)
    primitive_cube((0.114, -0.026, 1.77), (0.034, 0.036, 0.18), hair_mat)
    primitive_cube((-0.062, -0.074, 1.64), (0.026, 0.028, 0.11), hair_mat)
    primitive_cube((0.062, -0.074, 1.64), (0.026, 0.028, 0.11), hair_mat)


def add_face(face_mat):
    primitive_cube((0.0, -0.165, 2.075), (0.05, 0.01, 0.01), face_mat)
    primitive_cube((0.0, -0.156, 2.01), (0.034, 0.008, 0.008), face_mat)


def add_base_body(skin_mat, under_mat, boot_mat):
    primitive_scaled_sphere((0.0, 0.0, 2.05), (0.16, 0.16, 0.185), skin_mat)
    primitive_cylinder_between((0.0, 0.0, 1.81), (0.0, 0.0, 1.91), 0.055, skin_mat)

    primitive_scaled_sphere((0.0, 0.0, 1.53), (0.20, 0.14, 0.29), under_mat)
    primitive_scaled_sphere((0.0, 0.0, 1.20), (0.17, 0.12, 0.20), under_mat)
    primitive_scaled_sphere((0.0, 0.0, 0.98), (0.18, 0.13, 0.14), under_mat)

    shoulder_l = (-0.245, 0.0, 1.61)
    elbow_l = (-0.37, 0.03, 1.31)
    wrist_l = (-0.41, 0.035, 1.01)
    shoulder_r = (0.245, 0.0, 1.61)
    elbow_r = (0.37, 0.03, 1.31)
    wrist_r = (0.41, 0.035, 1.01)

    hip_l = (-0.09, 0.0, 0.92)
    knee_l = (-0.105, 0.0, 0.49)
    ankle_l = (-0.10, 0.0, 0.12)
    hip_r = (0.09, 0.0, 0.92)
    knee_r = (0.105, 0.0, 0.49)
    ankle_r = (0.10, 0.0, 0.12)

    primitive_scaled_sphere((-0.255, 0.0, 1.60), (0.064, 0.064, 0.072), under_mat)
    primitive_scaled_sphere((0.255, 0.0, 1.60), (0.064, 0.064, 0.072), under_mat)
    primitive_cylinder_between(shoulder_l, elbow_l, 0.053, skin_mat)
    primitive_cylinder_between(elbow_l, wrist_l, 0.042, skin_mat)
    primitive_cylinder_between(shoulder_r, elbow_r, 0.053, skin_mat)
    primitive_cylinder_between(elbow_r, wrist_r, 0.042, skin_mat)
    primitive_scaled_sphere((-0.415, 0.03, 0.97), (0.038, 0.038, 0.065), skin_mat)
    primitive_scaled_sphere((0.415, 0.03, 0.97), (0.038, 0.038, 0.065), skin_mat)

    primitive_cylinder_between(hip_l, knee_l, 0.075, skin_mat)
    primitive_cylinder_between(knee_l, ankle_l, 0.058, skin_mat)
    primitive_cylinder_between(hip_r, knee_r, 0.075, skin_mat)
    primitive_cylinder_between(knee_r, ankle_r, 0.058, skin_mat)
    primitive_scaled_sphere((-0.096, 0.0, 0.91), (0.074, 0.074, 0.10), under_mat)
    primitive_scaled_sphere((0.096, 0.0, 0.91), (0.074, 0.074, 0.10), under_mat)
    primitive_cube((-0.10, -0.01, 0.035), (0.072, 0.115, 0.045), boot_mat)
    primitive_cube((0.10, -0.01, 0.035), (0.072, 0.115, 0.045), boot_mat)


def add_leather_armor(leather_mat, trim_mat, buckle_mat):
    primitive_scaled_sphere((0.0, -0.005, 1.50), (0.215, 0.105, 0.255), leather_mat)
    primitive_scaled_sphere((0.0, -0.012, 1.17), (0.175, 0.095, 0.17), leather_mat)
    primitive_cube((0.0, -0.035, 1.45), (0.12, 0.032, 0.26), trim_mat)
    primitive_cube((0.0, -0.02, 1.14), (0.16, 0.03, 0.03), buckle_mat)
    primitive_cube((0.0, 0.028, 1.27), (0.14, 0.02, 0.08), buckle_mat)

    primitive_scaled_sphere((-0.255, 0.0, 1.60), (0.075, 0.075, 0.085), trim_mat)
    primitive_scaled_sphere((0.255, 0.0, 1.60), (0.075, 0.075, 0.085), trim_mat)
    primitive_cube((-0.39, -0.002, 1.16), (0.05, 0.048, 0.10), leather_mat)
    primitive_cube((0.39, -0.002, 1.16), (0.05, 0.048, 0.10), leather_mat)

    primitive_cube((-0.10, -0.008, 0.66), (0.082, 0.06, 0.24), leather_mat)
    primitive_cube((0.10, -0.008, 0.66), (0.082, 0.06, 0.24), leather_mat)
    primitive_cube((-0.10, -0.018, 0.24), (0.074, 0.068, 0.12), trim_mat)
    primitive_cube((0.10, -0.018, 0.24), (0.074, 0.068, 0.12), trim_mat)
    primitive_cube((-0.10, -0.026, 0.05), (0.084, 0.11, 0.04), buckle_mat)
    primitive_cube((0.10, -0.026, 0.05), (0.084, 0.11, 0.04), buckle_mat)


def add_lighting():
    bpy.ops.object.light_add(type="SUN", location=(0.0, -2.6, 3.5))
    sun = bpy.context.object
    sun.rotation_euler = Euler((math.radians(36), math.radians(4), math.radians(12)), "XYZ")
    sun.data.energy = 2.5

    bpy.ops.object.light_add(type="AREA", location=(0.0, -2.1, 2.05))
    fill = bpy.context.object
    fill.data.energy = 2200
    fill.data.shape = "RECTANGLE"
    fill.data.size = 4.1
    fill.data.size_y = 4.1
    fill.rotation_euler = Euler((math.radians(78), 0.0, 0.0), "XYZ")

    bpy.ops.object.light_add(type="AREA", location=(1.55, 1.35, 1.9))
    rim = bpy.context.object
    rim.data.energy = 930
    rim.data.shape = "RECTANGLE"
    rim.data.size = 2.8
    rim.data.size_y = 2.8
    rim.rotation_euler = Euler((math.radians(122), 0.0, math.radians(136)), "XYZ")

    world = bpy.context.scene.world
    if world is None:
        world = bpy.data.worlds.new("World")
        bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.02, 0.024, 0.034, 1.0)
    bg.inputs["Strength"].default_value = 0.22


def add_camera():
    bpy.ops.object.camera_add(location=(0.0, -5.6, 1.34))
    camera = bpy.context.object
    camera.data.lens = 46
    camera.rotation_euler = Euler((math.radians(88), 0.0, 0.0), "XYZ")
    bpy.context.scene.camera = camera
    return camera


def add_camera_l2():
    bpy.ops.object.camera_add(location=(0.0, -1.12, 0.16))
    camera = bpy.context.object
    camera.data.lens = 58
    camera.rotation_euler = Euler((math.radians(88), 0.0, 0.0), "XYZ")
    bpy.context.scene.camera = camera
    return camera


def build_scene(variant):
    scene = clear_scene()

    used_l2 = add_l2_fighter_profile_animated(variant)
    if not used_l2:
        used_l2 = add_l2_fighter_profile(variant)

    if not used_l2:
        skin_mat = make_material("Skin", (0.78, 0.68, 0.60), metallic=0.0, roughness=0.58, specular=0.42)
        under_mat = make_material("UnderCloth", (0.22, 0.23, 0.27), metallic=0.0, roughness=0.84, specular=0.2)
        boot_mat = make_material("Boot", (0.19, 0.17, 0.15), metallic=0.06, roughness=0.72, specular=0.22)
        hair_mat = make_material("Hair", (0.63, 0.53, 0.28), metallic=0.03, roughness=0.74, specular=0.2)
        face_mat = make_material("Face", (0.09, 0.08, 0.08), metallic=0.0, roughness=0.88, specular=0.1)

        add_base_body(skin_mat, under_mat, boot_mat)
        add_hair(hair_mat)
        add_face(face_mat)

        if variant == "leather":
            leather_mat = make_material("Leather", (0.33, 0.22, 0.14), metallic=0.06, roughness=0.68, specular=0.24)
            trim_mat = make_material("Trim", (0.73, 0.61, 0.30), metallic=0.88, roughness=0.22, specular=0.56)
            buckle_mat = make_material("Buckle", (0.77, 0.78, 0.82), metallic=0.76, roughness=0.26, specular=0.62)
            add_leather_armor(leather_mat, trim_mat, buckle_mat)

    add_lighting()
    if used_l2:
        add_camera_l2()
    else:
        add_camera()
    return scene


def export_glb(output_glb):
    os.makedirs(os.path.dirname(output_glb), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=output_glb,
        export_format="GLB",
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_animations=True,
        export_animation_mode="ACTIONS",
        export_force_sampling=True,
        use_selection=False,
        export_yup=True,
    )


def render_poster(scene, output_poster, resolution):
    scene.render.resolution_x = resolution
    scene.render.resolution_y = resolution
    scene.render.filepath = output_poster
    os.makedirs(os.path.dirname(output_poster), exist_ok=True)
    bpy.ops.render.render(write_still=True)


def main():
    args = parse_args()
    scene = build_scene(args.variant)
    export_glb(args.output_glb)
    render_poster(scene, args.output_poster, args.resolution)


if __name__ == "__main__":
    main()
