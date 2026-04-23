#!/usr/bin/env python
from __future__ import annotations

import argparse
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


def export_object(umodel: Path, l2_root: Path, out_dir: Path, package: str, object_name: str) -> str:
    cmd = [str(umodel), f"-path={l2_root}", "-game=l2", "-export", f"-out={out_dir}", package, object_name]
    proc = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="ignore")
    output = (proc.stdout or "") + (proc.stderr or "")
    if proc.returncode != 0 or "exporting" not in output.lower():
        raise RuntimeError(output.strip() or f"Failed to export {object_name}")
    return output


def convert_tga_to_png(export_root: Path) -> list[Path]:
    pngs: list[Path] = []
    for tga_path in export_root.rglob("*.tga"):
        png_path = tga_path.with_suffix(".png")
        try:
            Image.open(tga_path).save(png_path)
            pngs.append(png_path)
        except Exception as exc:  # pragma: no cover - best-effort conversion
            print(f"Skip PNG conversion for {tga_path.name}: {exc}", file=sys.stderr)
    return pngs


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export a batch of named Lineage II objects from a package and convert any TGA output to PNG."
    )
    parser.add_argument("--l2-root", required=True, help="Path to the Lineage II client root.")
    parser.add_argument("--package", required=True, help="Package to export from, e.g. FFighter.utx.")
    parser.add_argument(
        "--object",
        dest="objects",
        action="append",
        default=[],
        help="Object name to export. Can be specified multiple times."
    )
    parser.add_argument(
        "--objects-file",
        help="Optional text file with one object name per line."
    )
    parser.add_argument("--umodel", default=str(DEFAULT_UMODEL), help="Path to umodel.exe.")
    parser.add_argument(
        "--output",
        default=str(PROJECT_ROOT / "_l2_object_batch"),
        help="Directory to place exported files."
    )
    return parser.parse_args()


def load_object_names(args: argparse.Namespace) -> list[str]:
    objects = list(args.objects)
    if args.objects_file:
        file_path = Path(args.objects_file).resolve()
        if not file_path.exists():
            raise SystemExit(f"Objects file not found: {file_path}")
        objects.extend(
            line.strip()
            for line in file_path.read_text(encoding="utf-8").splitlines()
            if line.strip() and not line.strip().startswith("#")
        )
    deduped: list[str] = []
    seen: set[str] = set()
    for obj in objects:
        key = obj.lower()
        if key in seen:
            continue
        seen.add(key)
        deduped.append(obj)
    if not deduped:
        raise SystemExit("No object names provided. Use --object or --objects-file.")
    return deduped


def main() -> int:
    args = parse_args()

    l2_root = Path(args.l2_root).resolve()
    umodel = Path(args.umodel).resolve()
    out_dir = Path(args.output).resolve()
    object_names = load_object_names(args)

    if not l2_root.exists():
        raise SystemExit(f"L2 root not found: {l2_root}")
    if not umodel.exists():
        raise SystemExit(f"umodel not found: {umodel}")

    batch_slug = Path(args.package).stem.lower()
    target_dir = out_dir / batch_slug
    target_dir.mkdir(parents=True, exist_ok=True)

    print(f"Export package: {args.package}")
    for object_name in object_names:
        print(f"  - {object_name}")
        export_object(umodel, l2_root, target_dir, args.package, object_name)

    pngs = convert_tga_to_png(target_dir)
    if pngs:
        print("\nConverted PNG files:")
        for png_path in pngs:
            print(f"  - {png_path}")
    else:
        print("\nNo PNG files were generated.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
