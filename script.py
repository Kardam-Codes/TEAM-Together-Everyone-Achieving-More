"""
Feature: Repository Export
File Purpose: Export the repository into one AI-friendly text file
Owner: Jay
Dependencies: Python standard library
Last Updated: 2026-03-14
"""
from __future__ import annotations

import argparse
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parent
DEFAULT_OUTPUT = "repo_for_ai.txt"
DEFAULT_INCLUDE_EXTENSIONS = {
    ".py",
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".json",
    ".md",
    ".txt",
    ".csv",
    ".html",
    ".css",
    ".yml",
    ".yaml",
    ".env",
    ".mmd",
    ".sh",
    ".ps1",
}
DEFAULT_EXCLUDED_DIRS = {
    ".git",
    ".idea",
    ".vscode",
    "__pycache__",
    "node_modules",
    "dist",
    "build",
    ".vite",
    ".next",
    ".venv",
    "venv",
    "env",
}
DEFAULT_EXCLUDED_FILES = {
    DEFAULT_OUTPUT,
}
MAX_FILE_BYTES = 300_000


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Export this repository into a single text file for AI review."
    )
    parser.add_argument(
        "-o",
        "--output",
        default=DEFAULT_OUTPUT,
        help="Output file path relative to the repository root.",
    )
    parser.add_argument(
        "--max-bytes",
        type=int,
        default=MAX_FILE_BYTES,
        help="Skip files larger than this many bytes.",
    )
    parser.add_argument(
        "--include-all-text",
        action="store_true",
        help="Include any UTF-8 decodable text file, even if its extension is not whitelisted.",
    )
    return parser.parse_args()


def is_excluded_dir(path: Path) -> bool:
    return any(part in DEFAULT_EXCLUDED_DIRS for part in path.parts)


def should_include_file(path: Path, max_bytes: int, include_all_text: bool, output_name: str) -> bool:
    if path.name in DEFAULT_EXCLUDED_FILES or path.name == output_name:
        return False
    if is_excluded_dir(path.relative_to(REPO_ROOT)):
        return False
    if not path.is_file():
        return False
    if path.stat().st_size > max_bytes:
        return False
    if path.suffix.lower() in DEFAULT_INCLUDE_EXTENSIONS:
        return True
    return include_all_text and is_probably_text(path)


def is_probably_text(path: Path) -> bool:
    try:
        with path.open("rb") as handle:
            chunk = handle.read(4096)
    except OSError:
        return False

    if b"\x00" in chunk:
        return False

    try:
        chunk.decode("utf-8")
    except UnicodeDecodeError:
        return False

    return True


def gather_files(max_bytes: int, include_all_text: bool, output_name: str) -> list[Path]:
    files: list[Path] = []
    for path in REPO_ROOT.rglob("*"):
        if should_include_file(path, max_bytes, include_all_text, output_name):
            files.append(path)
    return sorted(files, key=lambda item: item.relative_to(REPO_ROOT).as_posix())


def make_repo_summary(files: list[Path]) -> str:
    extensions: dict[str, int] = {}
    top_level: dict[str, int] = {}

    for path in files:
        rel = path.relative_to(REPO_ROOT)
        extensions[path.suffix.lower() or "[no extension]"] = extensions.get(path.suffix.lower() or "[no extension]", 0) + 1
        top = rel.parts[0] if rel.parts else "."
        top_level[top] = top_level.get(top, 0) + 1

    extension_lines = "\n".join(
        f"- {extension}: {count}" for extension, count in sorted(extensions.items(), key=lambda item: (-item[1], item[0]))
    )
    top_level_lines = "\n".join(
        f"- {name}: {count} files" for name, count in sorted(top_level.items(), key=lambda item: item[0])
    )

    return (
        "# Repository Export For AI\n\n"
        "This file contains a structured export of the repository for use by an AI agent.\n"
        "It includes a file manifest and the full contents of included text files.\n\n"
        f"Repository root: {REPO_ROOT}\n"
        f"Included files: {len(files)}\n\n"
        "## Top-Level Coverage\n"
        f"{top_level_lines}\n\n"
        "## Extension Breakdown\n"
        f"{extension_lines}\n"
    )


def language_hint(path: Path) -> str:
    mapping = {
        ".py": "python",
        ".js": "javascript",
        ".jsx": "jsx",
        ".ts": "typescript",
        ".tsx": "tsx",
        ".json": "json",
        ".md": "markdown",
        ".txt": "text",
        ".csv": "csv",
        ".html": "html",
        ".css": "css",
        ".yml": "yaml",
        ".yaml": "yaml",
        ".mmd": "mermaid",
        ".sh": "bash",
        ".ps1": "powershell",
    }
    return mapping.get(path.suffix.lower(), "text")


def build_manifest(files: list[Path]) -> str:
    lines = ["## File Manifest"]
    for path in files:
        rel = path.relative_to(REPO_ROOT).as_posix()
        lines.append(f"- {rel}")
    return "\n".join(lines)


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def build_file_sections(files: list[Path]) -> str:
    sections: list[str] = ["## File Contents"]
    for path in files:
        rel = path.relative_to(REPO_ROOT).as_posix()
        sections.append(f"\n### FILE: {rel}\n")
        sections.append(f"```{language_hint(path)}")
        sections.append(read_text(path).rstrip())
        sections.append("```")
    return "\n".join(sections)


def main() -> int:
    args = parse_args()
    output_path = REPO_ROOT / args.output
    files = gather_files(args.max_bytes, args.include_all_text, output_path.name)

    content = "\n\n".join(
        [
            make_repo_summary(files),
            build_manifest(files),
            build_file_sections(files),
        ]
    )

    output_path.write_text(content, encoding="utf-8")

    print(f"Wrote AI export to: {output_path}")
    print(f"Included files: {len(files)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())