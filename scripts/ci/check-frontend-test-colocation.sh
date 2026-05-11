#!/usr/bin/env bash
# Frontend test-colocation gate.
#
# For every changed file under frontend/src/components/** or frontend/src/services/**
# that is not itself a test file, this script requires that at least one
# colocated *.test.{ts,tsx,js,jsx} sibling either changed in the same diff
# (modifications) or exists on disk (new files). Paths listed in
# .github/frontend-test-gate-allowlist.txt are skipped.
#
# Usage:
#   scripts/ci/check-frontend-test-colocation.sh [BASE_REF]
#
# BASE_REF defaults to the BASE_SHA / BASE_REF env vars (set by CI) or
# `origin/main`. Run locally before pushing:
#   BASE_REF=origin/main scripts/ci/check-frontend-test-colocation.sh

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

BASE_REF="${1:-${BASE_SHA:-${BASE_REF:-origin/main}}}"
ALLOWLIST_FILE=".github/frontend-test-gate-allowlist.txt"

if ! git rev-parse --verify --quiet "$BASE_REF" >/dev/null; then
  echo "check-frontend-test-colocation: cannot resolve base ref '$BASE_REF'." >&2
  echo "Fetch it first (e.g. 'git fetch origin main:refs/remotes/origin/main') or pass a valid ref." >&2
  exit 2
fi

# Files changed (added/modified/renamed/copied) between BASE_REF and HEAD.
mapfile -t CHANGED < <(git diff --name-only --diff-filter=AMRC "$BASE_REF"...HEAD)

if [[ ${#CHANGED[@]} -eq 0 ]]; then
  echo "check-frontend-test-colocation: no changes vs $BASE_REF; skipping."
  exit 0
fi

# Build allowlist set (ignore blanks and comments).
ALLOW=()
if [[ -f "$ALLOWLIST_FILE" ]]; then
  while IFS= read -r line; do
    line="${line%%#*}"
    line="${line//$'\r'/}"
    line="$(echo -n "$line" | sed -e 's/^[[:space:]]*//' -e 's/[[:space:]]*$//')"
    [[ -n "$line" ]] && ALLOW+=("$line")
  done < "$ALLOWLIST_FILE"
fi

is_allowlisted() {
  local path="$1"
  for entry in "${ALLOW[@]:-}"; do
    [[ "$path" == "$entry" ]] && return 0
  done
  return 1
}

is_source_under_gate() {
  local path="$1"
  [[ "$path" == frontend/src/components/* || "$path" == frontend/src/services/* ]] || return 1
  [[ "$path" == *.test.ts || "$path" == *.test.tsx || "$path" == *.test.js || "$path" == *.test.jsx ]] && return 1
  [[ "$path" == *.d.ts ]] && return 1
  [[ "$path" == */__tests__/* ]] && return 1
  case "$path" in
    *.ts|*.tsx|*.js|*.jsx) return 0 ;;
    *) return 1 ;;
  esac
}

has_colocated_test_in_diff() {
  local base_no_ext="$1"
  for f in "${CHANGED[@]}"; do
    case "$f" in
      "$base_no_ext".test.ts|"$base_no_ext".test.tsx|"$base_no_ext".test.js|"$base_no_ext".test.jsx)
        return 0
        ;;
    esac
  done
  return 1
}

has_colocated_test_on_disk() {
  local base_no_ext="$1"
  for ext in ts tsx js jsx; do
    [[ -f "$base_no_ext.test.$ext" ]] && return 0
  done
  return 1
}

VIOLATIONS=()
for path in "${CHANGED[@]}"; do
  is_source_under_gate "$path" || continue
  is_allowlisted "$path" && continue

  base_no_ext="${path%.*}"
  is_new=false
  if ! git cat-file -e "$BASE_REF":"$path" 2>/dev/null; then
    is_new=true
  fi

  if $is_new; then
    if ! has_colocated_test_on_disk "$base_no_ext"; then
      VIOLATIONS+=("NEW $path (no colocated *.test.* on disk)")
    fi
  else
    if ! has_colocated_test_in_diff "$base_no_ext"; then
      VIOLATIONS+=("MODIFIED $path (no colocated *.test.* changed in this diff)")
    fi
  fi
done

if [[ ${#VIOLATIONS[@]} -gt 0 ]]; then
  echo "check-frontend-test-colocation: missing colocated tests for the following changes:" >&2
  for v in "${VIOLATIONS[@]}"; do
    echo "  - $v" >&2
  done
  cat >&2 <<'MSG'

Every changed file under frontend/src/components or frontend/src/services
must ship with a paired *.test.{ts,tsx,js,jsx} change. If a path is a
non-behavioral exception (pure re-export, generated stub, etc.) add it to
.github/frontend-test-gate-allowlist.txt with a justification comment.
MSG
  exit 1
fi

echo "check-frontend-test-colocation: OK"
MSG_OK=$(printf 'gate passed: %d changed file(s) inspected.' "${#CHANGED[@]}")
echo "$MSG_OK"
