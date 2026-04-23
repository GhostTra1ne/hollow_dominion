#!/usr/bin/env python
from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageColor, ImageDraw, ImageFont


LAYER_ORDER = [
    "leg_l",
    "leg_r",
    "armor_leg_l",
    "armor_leg_r",
    "shield",
    "arm_l",
    "armor_arm_l",
    "head_base",
    "face",
    "torso",
    "armor_torso",
    "arm_r",
    "armor_arm_r",
    "weapon",
    "pelvis",
    "armor_pelvis",
]

SLOT_MAP = {
    "leg_l": ("base", "leg_l.png"),
    "leg_r": ("base", "leg_r.png"),
    "arm_l": ("base", "arm_l.png"),
    "arm_r": ("base", "arm_r.png"),
    "torso": ("base", "torso.png"),
    "pelvis": ("base", "pelvis.png"),
    "head_base": ("base", "head.png"),
    "face": ("face", "{face}.png"),
    "armor_torso": ("equipment", "leather_shirt/torso.png"),
    "armor_arm_l": ("equipment", "leather_shirt/arm_l.png"),
    "armor_arm_r": ("equipment", "leather_shirt/arm_r.png"),
    "armor_pelvis": ("equipment", "leather_pants/pelvis.png"),
    "armor_leg_l": ("equipment", "leather_pants/leg_l.png"),
    "armor_leg_r": ("equipment", "leather_pants/leg_r.png"),
    "weapon": ("missing", ""),
    "shield": ("missing", ""),
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build a quick 2D preview image from current paperdoll layer folders."
    )
    parser.add_argument("--character-root", required=True, help="Path to character folder, e.g. assets/characters/human/male")
    parser.add_argument("--archetype", default="warrior", help="Class preview archetype folder name.")
    parser.add_argument("--face", default="01", help="Face PNG number from faces folder.")
    parser.add_argument("--output", required=True, help="Output PNG path.")
    parser.add_argument("--show-base", action="store_true", help="Render side-by-side base and equipped preview.")
    parser.add_argument("--label", default="Leather Preview", help="Optional label.")
    parser.add_argument("--background", default="#15110d", help="Background color.")
    parser.add_argument(
        "--base-source",
        choices=("base", "class_preview"),
        default="base",
        help="Which folder to use for the unequipped body layers.",
    )
    return parser.parse_args()


def alpha_over(base: Image.Image, layer: Image.Image) -> Image.Image:
    return Image.alpha_composite(base, layer)


def load_layer(character_root: Path, archetype: str, face: str, slot: str, base_source: str) -> Image.Image | None:
    source_type, relative = SLOT_MAP[slot]
    if source_type == "missing":
        return None
    if source_type == "base":
        if base_source == "base":
            path = character_root / "base" / relative
        else:
            path = character_root / "class_preview" / archetype / relative
    elif source_type == "face":
        path = character_root / "faces" / relative.format(face=face)
    else:
        path = character_root / "equipment" / relative
    if not path.exists():
        return None
    return Image.open(path).convert("RGBA")


def render_character(character_root: Path, archetype: str, face: str, include_equipment: bool, base_source: str) -> Image.Image:
    canvas: Image.Image | None = None
    for slot in LAYER_ORDER:
        if not include_equipment and slot.startswith("armor_"):
            continue
        layer = load_layer(character_root, archetype, face, slot, base_source=base_source)
        if layer is None:
            continue
        if canvas is None:
            canvas = Image.new("RGBA", layer.size, (0, 0, 0, 0))
        canvas = alpha_over(canvas, layer)
    if canvas is None:
        raise SystemExit("No layers found to render preview.")
    return canvas


def load_font(size: int) -> ImageFont.ImageFont:
    try:
        return ImageFont.truetype("arial.ttf", size)
    except Exception:
        return ImageFont.load_default()


def build_preview(base_image: Image.Image, equipped_image: Image.Image, label: str, background: str, show_base: bool) -> Image.Image:
    bg_rgba = ImageColor.getcolor(background, "RGBA")
    padding = 36
    gap = 32
    label_height = 56
    stroke = (20, 14, 10, 255)
    text = (242, 231, 209, 255)
    subtitle = (190, 173, 141, 255)

    panel_width = equipped_image.width
    panel_height = equipped_image.height
    columns = 2 if show_base else 1
    width = padding * 2 + panel_width * columns + (gap if show_base else 0)
    height = padding * 2 + panel_height + label_height
    canvas = Image.new("RGBA", (width, height), bg_rgba)
    draw = ImageDraw.Draw(canvas)

    title_font = load_font(30)
    small_font = load_font(22)

    draw.text((padding, 12), label, fill=text, font=title_font, stroke_width=2, stroke_fill=stroke)
    if show_base:
        draw.text((padding, 48), "Base", fill=subtitle, font=small_font)
        draw.text((padding + panel_width + gap, 48), "Equipped", fill=subtitle, font=small_font)
        canvas.alpha_composite(base_image, (padding, padding + label_height))
        canvas.alpha_composite(equipped_image, (padding + panel_width + gap, padding + label_height))
    else:
        canvas.alpha_composite(equipped_image, (padding, padding + label_height))
    return canvas


def main() -> None:
    args = parse_args()
    character_root = Path(args.character_root).resolve()
    output_path = Path(args.output).resolve()

    base_image = render_character(character_root, args.archetype, args.face, include_equipment=False, base_source=args.base_source)
    equipped_image = render_character(character_root, args.archetype, args.face, include_equipment=True, base_source=args.base_source)
    preview = build_preview(base_image, equipped_image, args.label, args.background, args.show_base)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    preview.save(output_path)
    print(output_path)


if __name__ == "__main__":
    main()
