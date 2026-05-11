#!/usr/bin/env bash
# If .cursor/skills is a symlink to ai-specs/skills, there is nothing to mirror.
# If the project uses two independent trees, rsync from .cursor/skills to ai-specs/skills.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${ROOT}/.cursor/skills"
DST="${ROOT}/ai-specs/skills"

resolve_realpath() {
  if command -v realpath >/dev/null 2>&1; then
    realpath "$1"
  elif readlink -f / >/dev/null 2>&1; then
    readlink -f "$1"
  else
    (cd "$1" 2>/dev/null && pwd -P)
  fi
}

SRC_REAL="$(resolve_realpath "$SRC" 2>/dev/null || true)"
DST_REAL="$(resolve_realpath "$DST" 2>/dev/null || true)"
if [[ -n "$SRC_REAL" && -n "$DST_REAL" && "$SRC_REAL" == "$DST_REAL" ]]; then
  echo "sync-ai-specs-skills: .cursor/skills and ai-specs/skills are the same path (symlink layout); skip rsync."
  exit 0
fi
rsync -a --delete "${SRC}/" "${DST}/"
