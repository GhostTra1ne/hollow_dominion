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

    parser = argparse.ArgumentParser(description="Build a stylized 3D profile mannequin.")
    parser.add_argument("--output-glb", required=True)
    parser.add_argument("--output-poster", required=True)
    parser.add_argument("--resolution", type=int, default=1440)
    return parser.parse_args(argv)


def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = "PNG"
    if hasattr(scene.eevee, "taa_render_samples"):
        scene.eevee.taa_render_samples = 32
    if hasattr(scene.eevee, "use_gtao"):
        scene.eevee.use_gtao = True
    if hasattr(scene.eevee, "use_bloom"):
        scene.eevee.use_bloom = True
    if hasattr(scene.eevee, "bloom_intensity"):
        scene.eevee.bloom_intensity = 0.03
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


def create_body(body_mat, cloth_mat, plate_mat, trim_mat):
    parts = []

    parts.append(primitive_uv_sphere((0.0, 0.0, 2.06), 0.19, body_mat))
    parts.append(primitive_cylinder_between((0.0, 0.0, 1.74), (0.0, 0.0, 1.88), 0.085, body_mat))

    torso = primitive_cube((0.0, 0.0, 1.47), (0.28, 0.17, 0.39), cloth_mat)
    parts.append(torso)
    parts.append(primitive_cube((0.0, -0.02, 1.5), (0.31, 0.12, 0.26), plate_mat))
    parts.append(primitive_cube((0.0, -0.035, 1.53), (0.22, 0.09, 0.18), trim_mat))
    parts.append(primitive_cube((0.0, 0.0, 1.02), (0.24, 0.16, 0.17), cloth_mat))
    parts.append(primitive_cube((0.0, -0.018, 0.99), (0.26, 0.12, 0.13), plate_mat))

    shoulder_l = (-0.34, 0.0, 1.62)
    elbow_l = (-0.49, 0.01, 1.34)
    wrist_l = (-0.54, 0.01, 1.02)
    shoulder_r = (0.34, 0.0, 1.62)
    elbow_r = (0.49, 0.01, 1.34)
    wrist_r = (0.54, 0.01, 1.02)

    hip_l = (-0.14, 0.0, 0.9)
    knee_l = (-0.15, 0.0, 0.49)
    ankle_l = (-0.12, 0.0, 0.13)
    hip_r = (0.14, 0.0, 0.9)
    knee_r = (0.15, 0.0, 0.49)
    ankle_r = (0.12, 0.0, 0.13)

    parts.append(primitive_cylinder_between(shoulder_l, elbow_l, 0.08, cloth_mat))
    parts.append(primitive_cylinder_between(elbow_l, wrist_l, 0.068, body_mat))
    parts.append(primitive_cylinder_between(shoulder_r, elbow_r, 0.08, cloth_mat))
    parts.append(primitive_cylinder_between(elbow_r, wrist_r, 0.068, body_mat))
    parts.append(primitive_cube((-0.52, -0.005, 1.08), (0.07, 0.055, 0.14), plate_mat))
    parts.append(primitive_cube((0.52, -0.005, 1.08), (0.07, 0.055, 0.14), plate_mat))
    parts.append(primitive_cube((-0.30, -0.005, 1.65), (0.11, 0.08, 0.08), trim_mat))
    parts.append(primitive_cube((0.30, -0.005, 1.65), (0.11, 0.08, 0.08), trim_mat))

    parts.append(primitive_cylinder_between(hip_l, knee_l, 0.103, cloth_mat))
    parts.append(primitive_cylinder_between(knee_l, ankle_l, 0.087, body_mat))
    parts.append(primitive_cylinder_between(hip_r, knee_r, 0.103, cloth_mat))
    parts.append(primitive_cylinder_between(knee_r, ankle_r, 0.087, body_mat))
    parts.append(primitive_cube((-0.12, -0.01, 0.28), (0.09, 0.07, 0.16), plate_mat))
    parts.append(primitive_cube((0.12, -0.01, 0.28), (0.09, 0.07, 0.16), plate_mat))
    parts.append(primitive_cube((-0.12, -0.045, 0.04), (0.11, 0.16, 0.05), trim_mat))
    parts.append(primitive_cube((0.12, -0.045, 0.04), (0.11, 0.16, 0.05), trim_mat))

    parts.append(primitive_cube((0.0, 0.04, 1.33), (0.12, 0.03, 0.22), trim_mat))
    parts.append(primitive_cube((0.0, 0.04, 1.12), (0.16, 0.03, 0.16), trim_mat))

    return parts


def add_lighting():
    bpy.ops.object.light_add(type="SUN", location=(0.0, -2.2, 3.4))
    sun = bpy.context.object
    sun.rotation_euler = Euler((math.radians(32), math.radians(6), math.radians(14)), "XYZ")
    sun.data.energy = 2.2

    bpy.ops.object.light_add(type="AREA", location=(0.0, -2.0, 2.0))
    fill = bpy.context.object
    fill.data.energy = 1800
    fill.data.shape = "RECTANGLE"
    fill.data.size = 3.8
    fill.data.size_y = 3.8
    fill.rotation_euler = Euler((math.radians(78), 0.0, 0.0), "XYZ")

    bpy.ops.object.light_add(type="AREA", location=(1.4, 1.6, 1.8))
    rim = bpy.context.object
    rim.data.energy = 800
    rim.data.shape = "RECTANGLE"
    rim.data.size = 2.4
    rim.data.size_y = 2.4
    rim.rotation_euler = Euler((math.radians(120), 0.0, math.radians(132)), "XYZ")

    world = bpy.context.scene.world
    if world is None:
      world = bpy.data.worlds.new("World")
      bpy.context.scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.018, 0.021, 0.03, 1.0)
    bg.inputs["Strength"].default_value = 0.18


def add_camera():
    bpy.ops.object.camera_add(location=(0.0, -4.9, 1.42))
    camera = bpy.context.object
    camera.data.lens = 58
    camera.rotation_euler = Euler((math.radians(88), 0.0, 0.0), "XYZ")
    bpy.context.scene.camera = camera
    return camera


def build_scene():
    scene = clear_scene()

    body_mat = make_material("Body", (0.76, 0.66, 0.57), metallic=0.0, roughness=0.62, specular=0.4)
    cloth_mat = make_material("Cloth", (0.22, 0.23, 0.27), metallic=0.0, roughness=0.82, specular=0.25)
    plate_mat = make_material("Plate", (0.73, 0.76, 0.81), metallic=0.78, roughness=0.28, specular=0.65)
    trim_mat = make_material("Trim", (0.76, 0.60, 0.26), metallic=0.92, roughness=0.22, specular=0.55)

    create_body(body_mat, cloth_mat, plate_mat, trim_mat)
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
    scene = build_scene()
    export_glb(args.output_glb)
    render_poster(scene, args.output_poster, args.resolution)


if __name__ == "__main__":
    main()
