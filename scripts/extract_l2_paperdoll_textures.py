#!/usr/bin/env python
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:  # pragma: no cover - runtime convenience
    print("Pillow is required. Install with: python -m pip install --user pillow", file=sys.stderr)
    raise


SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
DEFAULT_UMODEL = PROJECT_ROOT.parent / "tools" / "umodel.exe"


def run_umodel_list(umodel: Path, l2_root: Path, package: str) -> str:
    cmd = [str(umodel), f"-path={l2_root}", "-game=l2", "-list", package]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    output = (proc.stdout or "") + (proc.stderr or "")
    if "failed to load provided packages" in output.lower():
      raise RuntimeError(output.strip())
    return output


def pick_objects(listing: str, texture_prefix: str) -> list[str]:
    pattern = re.compile(rf"Texture\s+({re.escape(texture_prefix)}_[ulgb](?:_sp|_ori)?)\b", re.IGNORECASE)
    found: dict[str, str] = {}
    for match in pattern.finditer(listing):
        name = match.group(1)
        slot = name.split("_")[-2] if name.endswith(("_sp", "_ori")) else name.split("_")[-1]
        current = found.get(slot)
        if current is None:
            found[slot] = name
            continue
        if current.endswith("_sp") and name.endswith("_ori"):
            found[slot] = name
    return [found[key] for key in sorted(found)]


def export_object(umodel: Path, l2_root: Path, out_dir: Path, package: str, object_name: str) -> None:
    cmd = [str(umodel), f"-path={l2_root}", "-game=l2", "-export", f"-out={out_dir}", package, object_name]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    output = (proc.stdout or "") + (proc.stderr or "")
    if proc.returncode != 0 or "exporting" not in output.lower():
        raise RuntimeError(output.strip() or f"Failed to export {object_name}")


def convert_tga_to_png(export_root: Path) -> list[Path]:
    pngs: list[Path] = []
    for tga_path in export_root.rglob("*.tga"):
        png_path = tga_path.with_suffix(".png")
        Image.open(tga_path).save(png_path)
        pngs.append(png_path)
    return pngs


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Extract Lineage II paperdoll texture atlases for a specific armor code."
    )
    parser.add_argument("--l2-root", required=True, help="Path to the Lineage II client root.")
    parser.add_argument("--umodel", default=str(DEFAULT_UMODEL), help="Path to umodel.exe.")
    parser.add_argument("--package", default="FFighter.utx", help="Texture package to scan, e.g. FFighter.utx.")
    parser.add_argument("--texture-prefix", required=True, help="Texture prefix, e.g. FFighter_m001_t04.")
    parser.add_argument(
        "--output",
        default=str(PROJECT_ROOT / "_l2_paperdoll_extract"),
        help="Directory to place exported files."
    )
    args = parser.parse_args()

    l2_root = Path(args.l2_root).resolve()
    umodel = Path(args.umodel).resolve()
    out_dir = Path(args.output).resolve()

    if not l2_root.exists():
        raise SystemExit(f"L2 root not found: {l2_root}")
    if not umodel.exists():
        raise SystemExit(f"umodel not found: {umodel}")

    listing = run_umodel_list(umodel, l2_root, args.package)
    object_names = pick_objects(listing, args.texture_prefix)
    if not object_names:
        raise SystemExit(f"No matching textures found for prefix {args.texture_prefix} in {args.package}")

    target_dir = out_dir / args.texture_prefix.lower()
    target_dir.mkdir(parents=True, exist_ok=True)

    print(f"Found {len(object_names)} texture object(s):")
    for object_name in object_names:
        print(f"  - {object_name}")
        export_object(umodel, l2_root, target_dir, args.package, object_name)

    pngs = convert_tga_to_png(target_dir)
    print("\nConverted PNG files:")
    for png_path in pngs:
        print(f"  - {png_path}")

    print(
        "\nNote: these are UV texture atlases from the client. "
        "To turn them into clean profile layers, a mesh render step is still needed."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
