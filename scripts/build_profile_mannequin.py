import argparse
import math
import os
import sys

import bpy
from mathutils import Euler, Vector


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


def make_material(name, base_color, metallic=0.0, roughness=0.5, specular=0.5):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*base_color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Specular IOR Level"].default_value = specular
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


def add_hair(hair_mat):
    primitive_uv_sphere((0.0, 0.01, 2.12), 0.17, hair_mat)
    primitive_cube((0.0, -0.03, 1.98), (0.18, 0.06, 0.035), hair_mat)


def add_face(face_mat):
    primitive_cube((0.0, -0.18, 2.06), (0.06, 0.012, 0.012), face_mat)


def add_base_body(skin_mat, under_mat, boot_mat):
    primitive_uv_sphere((0.0, 0.0, 2.05), 0.18, skin_mat)
    primitive_cylinder_between((0.0, 0.0, 1.74), (0.0, 0.0, 1.88), 0.082, skin_mat)

    primitive_cube((0.0, 0.0, 1.47), (0.24, 0.15, 0.35), under_mat)
    primitive_cube((0.0, -0.018, 1.08), (0.18, 0.13, 0.22), under_mat)

    shoulder_l = (-0.30, 0.0, 1.62)
    elbow_l = (-0.42, 0.02, 1.33)
    wrist_l = (-0.45, 0.02, 1.02)
    shoulder_r = (0.30, 0.0, 1.62)
    elbow_r = (0.42, 0.02, 1.33)
    wrist_r = (0.45, 0.02, 1.02)

    hip_l = (-0.11, 0.0, 0.89)
    knee_l = (-0.12, 0.0, 0.48)
    ankle_l = (-0.10, 0.0, 0.12)
    hip_r = (0.11, 0.0, 0.89)
    knee_r = (0.12, 0.0, 0.48)
    ankle_r = (0.10, 0.0, 0.12)

    primitive_cylinder_between(shoulder_l, elbow_l, 0.075, skin_mat)
    primitive_cylinder_between(elbow_l, wrist_l, 0.064, skin_mat)
    primitive_cylinder_between(shoulder_r, elbow_r, 0.075, skin_mat)
    primitive_cylinder_between(elbow_r, wrist_r, 0.064, skin_mat)
    primitive_cube((-0.45, -0.005, 0.96), (0.05, 0.05, 0.11), skin_mat)
    primitive_cube((0.45, -0.005, 0.96), (0.05, 0.05, 0.11), skin_mat)

    primitive_cylinder_between(hip_l, knee_l, 0.092, skin_mat)
    primitive_cylinder_between(knee_l, ankle_l, 0.078, skin_mat)
    primitive_cylinder_between(hip_r, knee_r, 0.092, skin_mat)
    primitive_cylinder_between(knee_r, ankle_r, 0.078, skin_mat)
    primitive_cube((-0.10, -0.02, 0.05), (0.085, 0.13, 0.05), boot_mat)
    primitive_cube((0.10, -0.02, 0.05), (0.085, 0.13, 0.05), boot_mat)


def add_leather_armor(leather_mat, trim_mat, buckle_mat):
    primitive_cube((0.0, -0.01, 1.49), (0.28, 0.11, 0.30), leather_mat)
    primitive_cube((0.0, -0.032, 1.52), (0.22, 0.07, 0.21), trim_mat)
    primitive_cube((0.0, 0.0, 1.12), (0.21, 0.10, 0.17), leather_mat)
    primitive_cube((0.0, -0.034, 1.12), (0.18, 0.04, 0.04), buckle_mat)
    primitive_cube((0.0, 0.03, 1.28), (0.18, 0.025, 0.09), buckle_mat)

    primitive_cube((-0.29, -0.005, 1.62), (0.085, 0.07, 0.07), trim_mat)
    primitive_cube((0.29, -0.005, 1.62), (0.085, 0.07, 0.07), trim_mat)
    primitive_cube((-0.43, -0.004, 1.18), (0.055, 0.05, 0.11), leather_mat)
    primitive_cube((0.43, -0.004, 1.18), (0.055, 0.05, 0.11), leather_mat)

    primitive_cube((-0.11, -0.01, 0.67), (0.10, 0.07, 0.25), leather_mat)
    primitive_cube((0.11, -0.01, 0.67), (0.10, 0.07, 0.25), leather_mat)
    primitive_cube((-0.10, -0.03, 0.27), (0.09, 0.08, 0.15), trim_mat)
    primitive_cube((0.10, -0.03, 0.27), (0.09, 0.08, 0.15), trim_mat)
    primitive_cube((-0.10, -0.03, 0.08), (0.10, 0.14, 0.045), buckle_mat)
    primitive_cube((0.10, -0.03, 0.08), (0.10, 0.14, 0.045), buckle_mat)


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
    bpy.ops.object.camera_add(location=(0.0, -4.8, 1.36))
    camera = bpy.context.object
    camera.data.lens = 58
    camera.rotation_euler = Euler((math.radians(88), 0.0, 0.0), "XYZ")
    bpy.context.scene.camera = camera
    return camera


def build_scene(variant):
    scene = clear_scene()

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
