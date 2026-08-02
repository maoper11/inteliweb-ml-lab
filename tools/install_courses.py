from __future__ import annotations

import shutil
import sys
from pathlib import Path


def copy_missing(source: Path, destination: Path) -> tuple[int, int]:
    """Copy a curriculum tree without overwriting student files.

    A fresh installation receives the complete curriculum. During an
    environment rebuild, existing notebooks and course files are preserved;
    only new files that do not already exist are added.
    """

    if not source.is_dir():
        raise FileNotFoundError(f"Curriculum source not found: {source}")

    destination.mkdir(parents=True, exist_ok=True)

    copied = 0
    preserved = 0

    for source_path in source.rglob("*"):
        relative_path = source_path.relative_to(source)
        destination_path = destination / relative_path

        if source_path.is_dir():
            destination_path.mkdir(parents=True, exist_ok=True)
            continue

        destination_path.parent.mkdir(parents=True, exist_ok=True)

        if destination_path.exists():
            preserved += 1
            continue

        shutil.copy2(source_path, destination_path)
        copied += 1

    return copied, preserved


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: python install_courses.py <source> <destination>")
        return 2

    source = Path(sys.argv[1]).resolve()
    destination = Path(sys.argv[2]).resolve()

    copied, preserved = copy_missing(source, destination)

    print(f"Course source: {source}")
    print(f"Course destination: {destination}")
    print(f"New files copied: {copied}")
    print(f"Existing files preserved: {preserved}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
