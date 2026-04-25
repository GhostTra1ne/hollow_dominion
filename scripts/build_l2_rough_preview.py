#!/usr/bin/env python
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageFont


CANVAS_SIZE = (768, 1152)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build a rough paperdoll preview from rendered L2 armor parts and existing layer bounding boxes."
    )
    parser.add_argument("--character-root", required=True, help="Path to assets/characters/<race>/<gender>")
    parser.add_argument("--torso-render", required=True)
    parser.add_argument("--legs-render", required=True)
    parser.add_argument("--gloves-render", required=True)
    parser.add_argument("--boots-render", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--face", default="01")
    parser.add_argument("--background", default="#15110d")
    parser.add_argument("--label", default="L2 Leather Rough Preview")
    return parser.parse_args()


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def alpha_bbox(img: Image.Image):
    return img.getchannel("A").getbbox()


def crop_alpha(img: Image.Image) -> Image.Image:
    bbox = alpha_bbox(img)
    if not bbox:
        return img
    return img.crop(bbox)


def fit_to_bbox(
    source: Image.Image,
    bbox: tuple[int, int, int, int],
    canvas_size=CANVAS_SIZE,
    scale_bias: float = 1.0,
) -> Image.Image:
    x0, y0, x1, y1 = bbox
    target_w = max(x1 - x0, 1)
    target_h = max(y1 - y0, 1)
    src = crop_alpha(source)
    sw, sh = src.size
    scale = min(target_w / sw, target_h / sh) * scale_bias
    new_size = (max(1, int(sw * scale)), max(1, int(sh * scale)))
    resized = src.resize(new_size, Image.LANCZOS)
    layer = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    ox = x0 + (target_w - new_size[0]) // 2
    oy = y0 + (target_h - new_size[1]) // 2
    layer.alpha_composite(resized, (ox, oy))
    return layer


def split_horizontal(source: Image.Image, start_ratio: float, end_ratio: float) -> Image.Image:
    src = crop_alpha(source)
    w, h = src.size
    left = int(w * start_ratio)
    right = int(w * end_ratio)
    return src.crop((left, 0, max(left + 1, right), h))


def load_mask_bbox(path: Path) -> tuple[int, int, int, int]:
    bbox = alpha_bbox(load_rgba(path))
    if not bbox:
        raise SystemExit(f"No alpha bbox in mask: {path}")
    return bbox


def compose_layers(layers: list[Image.Image]) -> Image.Image:
    base = Image.new("RGBA", CANVAS_SIZE, (0, 0, 0, 0))
    for layer in layers:
        base = Image.alpha_composite(base, layer)
    return base


def load_font(size: int) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("arial.ttf", size)
    except Exception:
        return ImageFont.load_default()


def build_preview(base_body: Image.Image, equipped: Image.Image, label: str, background: str) -> Image.Image:
    padding = 36
    gap = 32
    label_h = 56
    bg_rgba = ImageColor.getcolor(background, "RGBA")
    stroke = (20, 14, 10, 255)
    text = (242, 231, 209, 255)
    subtitle = (190, 173, 141, 255)

    canvas = Image.new("RGBA", (padding * 2 + CANVAS_SIZE[0] * 2 + gap, padding * 2 + CANVAS_SIZE[1] + label_h), bg_rgba)
    draw = ImageDraw.Draw(canvas)
    title_font = load_font(30)
    small_font = load_font(22)
    draw.text((padding, 12), label, fill=text, font=title_font, stroke_width=2, stroke_fill=stroke)
    draw.text((padding, 48), "Base", fill=subtitle, font=small_font)
    draw.text((padding + CANVAS_SIZE[0] + gap, 48), "L2 rough equipped", fill=subtitle, font=small_font)
    canvas.alpha_composite(base_body, (padding, padding + label_h))
    canvas.alpha_composite(equipped, (padding + CANVAS_SIZE[0] + gap, padding + label_h))
    return canvas


def main() -> None:
    args = parse_args()
    character_root = Path(args.character_root).resolve()

    base_root = character_root / "base"
    face_root = character_root / "faces"
    equip_root = character_root / "equipment"

    torso_mask = load_mask_bbox(equip_root / "leather_shirt" / "torso.png")
    arm_l_mask = load_mask_bbox(equip_root / "leather_gloves" / "arm_l.png")
    arm_r_mask = load_mask_bbox(equip_root / "leather_gloves" / "arm_r.png")
    pelvis_mask = load_mask_bbox(equip_root / "leather_pants" / "pelvis.png")
    leg_l_mask = load_mask_bbox(equip_root / "leather_pants" / "leg_l.png")
    leg_r_mask = load_mask_bbox(equip_root / "leather_pants" / "leg_r.png")
    boot_l_mask = load_mask_bbox(equip_root / "leather_sandals" / "leg_l.png")
    boot_r_mask = load_mask_bbox(equip_root / "leather_sandals" / "leg_r.png")

    torso_render = load_rgba(Path(args.torso_render))
    legs_render = load_rgba(Path(args.legs_render))
    gloves_render = load_rgba(Path(args.gloves_render))
    boots_render = load_rgba(Path(args.boots_render))

    base_layers = [
        load_rgba(base_root / "leg_l.png"),
        load_rgba(base_root / "leg_r.png"),
        load_rgba(base_root / "arm_l.png"),
        load_rgba(base_root / "head.png"),
        load_rgba(face_root / f"{args.face}.png"),
        load_rgba(base_root / "torso.png"),
        load_rgba(base_root / "arm_r.png"),
        load_rgba(base_root / "pelvis.png"),
    ]
    base_body = compose_layers(base_layers)

    armor_layers = [
        fit_to_bbox(split_horizontal(legs_render, 0.52, 1.0), leg_l_mask, scale_bias=0.68),
        fit_to_bbox(split_horizontal(legs_render, 0.0, 0.48), leg_r_mask, scale_bias=0.68),
        fit_to_bbox(split_horizontal(boots_render, 0.52, 1.0), boot_l_mask, scale_bias=0.6),
        fit_to_bbox(split_horizontal(boots_render, 0.0, 0.48), boot_r_mask, scale_bias=0.6),
        fit_to_bbox(split_horizontal(gloves_render, 0.52, 1.0), arm_l_mask, scale_bias=0.62),
        fit_to_bbox(split_horizontal(gloves_render, 0.0, 0.48), arm_r_mask, scale_bias=0.62),
        fit_to_bbox(torso_render, torso_mask, scale_bias=0.86),
        fit_to_bbox(split_horizontal(legs_render, 0.2, 0.8), pelvis_mask, scale_bias=0.6),
    ]
    equipped = compose_layers(base_layers + armor_layers)

    preview = build_preview(base_body, equipped, args.label, args.background)
    output_path = Path(args.output).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    preview.save(output_path)
    print(output_path)


if __name__ == "__main__":
    main()
