#!/usr/bin/env bash
# If .cursor/skills is a symlink to ai-specs/skills, there is nothing to mirror.
# If the project uses two independent trees, rsync from .cursor/skills to ai-specs/skills.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${ROOT}/.cursor/skills"
DST="${ROOT}/ai-specs/skills"
SRC_REAL="$(readlink -f "$SRC" 2>/dev/null || true)"
DST_REAL="$(readlink -f "$DST" 2>/dev/null || true)"
if [[ -n "$SRC_REAL" && -n "$DST_REAL" && "$SRC_REAL" == "$DST_REAL" ]]; then
  echo "sync-ai-specs-skills: .cursor/skills and ai-specs/skills are the same path (symlink layout); skip rsync."
  exit 0
fi
rsync -a --delete "${SRC}/" "${DST}/"
