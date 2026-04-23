#!/usr/bin/env python
from __future__ import annotations

import argparse
import math
import sys
from pathlib import Path

import bpy


def parse_args() -> argparse.Namespace:
    argv = []
    if "--" in sys.argv:
        argv = sys.argv[sys.argv.index("--") + 1 :]
    parser = argparse.ArgumentParser(
        description="Import a glTF mesh into Blender, apply a texture, and render a transparent paperdoll layer."
    )
    parser.add_argument("--gltf", required=True, help="Path to the .gltf file.")
    parser.add_argument("--texture", help="Optional texture image to apply as Base Color.")
    parser.add_argument("--output", required=True, help="Output PNG path.")
    parser.add_argument("--ortho-scale", type=float, default=2.0, help="Orthographic camera scale.")
    parser.add_argument("--auto-frame", action="store_true", help="Fit orthographic scale to imported mesh bounds.")
    parser.add_argument("--camera-z", type=float, default=1.0, help="Camera height.")
    parser.add_argument("--camera-y", type=float, default=-6.0, help="Camera distance on Y.")
    parser.add_argument("--resolution-x", type=int, default=1024)
    parser.add_argument("--resolution-y", type=int, default=1024)
    parser.add_argument("--samples", type=int, default=32)
    return parser.parse_args(argv)


def clean_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block_collection in (
        bpy.data.meshes,
        bpy.data.materials,
        bpy.data.images,
        bpy.data.armatures,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(block_collection):
            if block.users == 0:
                block_collection.remove(block)


def import_gltf(gltf_path: Path) -> list[bpy.types.Object]:
    before = set(bpy.data.objects.keys())
    bpy.ops.import_scene.gltf(filepath=str(gltf_path))
    return [obj for obj in bpy.data.objects if obj.name not in before]


def ensure_material(obj: bpy.types.Object) -> bpy.types.Material:
    if obj.type != "MESH":
        raise ValueError(f"{obj.name} is not a mesh")
    if obj.data.materials:
        material = obj.data.materials[0]
    else:
        material = bpy.data.materials.new(name=f"{obj.name}_Mat")
        obj.data.materials.append(material)
    material.use_nodes = True
    return material


def apply_texture(material: bpy.types.Material, texture_path: Path) -> None:
    nt = material.node_tree
    nt.nodes.clear()

    output = nt.nodes.new("ShaderNodeOutputMaterial")
    output.location = (400, 0)

    bsdf = nt.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.location = (100, 0)
    bsdf.inputs["Roughness"].default_value = 0.85
    bsdf.inputs["Specular IOR Level"].default_value = 0.0

    image_node = nt.nodes.new("ShaderNodeTexImage")
    image_node.location = (-250, 0)
    image_node.image = bpy.data.images.load(str(texture_path), check_existing=True)

    nt.links.new(image_node.outputs["Color"], bsdf.inputs["Base Color"])
    if "Alpha" in image_node.outputs:
        nt.links.new(image_node.outputs["Alpha"], bsdf.inputs["Alpha"])
        material.blend_method = "BLEND"
    nt.links.new(bsdf.outputs["BSDF"], output.inputs["Surface"])


def setup_world() -> None:
    world = bpy.data.worlds.new("PaperdollWorld")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    if bg:
        bg.inputs[0].default_value = (0, 0, 0, 1)
        bg.inputs[1].default_value = 0.0


def setup_render(args: argparse.Namespace, output_path: Path) -> None:
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.samples = args.samples
    scene.render.resolution_x = args.resolution_x
    scene.render.resolution_y = args.resolution_y
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.filepath = str(output_path)


def setup_camera(args: argparse.Namespace) -> bpy.types.Object:
    camera_data = bpy.data.cameras.new("PaperdollCamera")
    camera_data.type = "ORTHO"
    camera_data.ortho_scale = args.ortho_scale
    camera_obj = bpy.data.objects.new("PaperdollCamera", camera_data)
    bpy.context.scene.collection.objects.link(camera_obj)
    camera_obj.location = (0.0, args.camera_y, args.camera_z)
    camera_obj.rotation_euler = (math.radians(90.0), 0.0, 0.0)
    bpy.context.scene.camera = camera_obj
    return camera_obj


def setup_light() -> None:
    light_data = bpy.data.lights.new(name="PaperdollSun", type="SUN")
    light_data.energy = 2.0
    light = bpy.data.objects.new(name="PaperdollSun", object_data=light_data)
    bpy.context.scene.collection.objects.link(light)
    light.rotation_euler = (math.radians(35.0), math.radians(0.0), math.radians(25.0))


def center_objects(imported: list[bpy.types.Object]) -> tuple[float, float]:
    mesh_objects = [obj for obj in imported if obj.type == "MESH"]
    if not mesh_objects:
        return 0.0, 0.0

    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objects[0]
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")

    min_x = min((obj.bound_box[i][0] for obj in mesh_objects for i in range(8)), default=0.0)
    max_x = max((obj.bound_box[i][0] for obj in mesh_objects for i in range(8)), default=0.0)
    min_z = min((obj.bound_box[i][2] for obj in mesh_objects for i in range(8)), default=0.0)
    max_z = max((obj.bound_box[i][2] for obj in mesh_objects for i in range(8)), default=0.0)
    center_x = (min_x + max_x) / 2.0
    center_z = (min_z + max_z) / 2.0

    for obj in imported:
        obj.location.x -= center_x
        obj.location.z -= center_z

    width = max_x - min_x
    height = max_z - min_z
    return width, height


def main() -> None:
    args = parse_args()
    gltf_path = Path(args.gltf).resolve()
    output_path = Path(args.output).resolve()
    texture_path = Path(args.texture).resolve() if args.texture else None

    if not gltf_path.exists():
        raise SystemExit(f"glTF not found: {gltf_path}")
    if texture_path and not texture_path.exists():
        raise SystemExit(f"Texture not found: {texture_path}")

    clean_scene()
    setup_world()
    setup_render(args, output_path)
    setup_camera(args)
    setup_light()

    imported = import_gltf(gltf_path)
    mesh_objects = [obj for obj in imported if obj.type == "MESH"]
    if not mesh_objects:
        raise SystemExit(f"No mesh objects imported from {gltf_path}")

    if texture_path:
        for obj in mesh_objects:
            material = ensure_material(obj)
            apply_texture(material, texture_path)

    width, height = center_objects(imported)
    if args.auto_frame and bpy.context.scene.camera and bpy.context.scene.camera.type == "CAMERA":
        camera_data = bpy.context.scene.camera.data
        camera_data.ortho_scale = max(width, height, 0.01) * 1.15
    bpy.ops.render.render(write_still=True)
    print(output_path)


if __name__ == "__main__":
    main()
