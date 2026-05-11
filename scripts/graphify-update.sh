#!/usr/bin/env bash
# Wrap `graphify update` so its known post-run NameError (see AGENTS.md) does
# not propagate a misleading non-zero exit code when the graph itself was
# refreshed. Exit 0 when graphify-out/GRAPH_REPORT.md changed (mtime + hash);
# exit 1 only when nothing changed AND graphify exited non-zero.
#
# Usage:
#   scripts/graphify-update.sh [args passed to `graphify update`]
# Defaults to `graphify update .` from the repo root.

set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

REPORT="graphify-out/GRAPH_REPORT.md"
GRAPH_JSON="graphify-out/graph.json"

fingerprint() {
  local path="$1"
  if [[ -f "$path" ]]; then
    local mtime
    mtime="$(stat -c '%Y' "$path" 2>/dev/null || stat -f '%m' "$path" 2>/dev/null || echo 0)"
    local hash=""
    if command -v sha256sum >/dev/null; then
      hash="$(sha256sum "$path" | awk '{print $1}')"
    elif command -v shasum >/dev/null; then
      hash="$(shasum -a 256 "$path" | awk '{print $1}')"
    fi
    echo "${mtime}:${hash}"
  else
    echo "absent"
  fi
}

BEFORE_REPORT="$(fingerprint "$REPORT")"
BEFORE_GRAPH="$(fingerprint "$GRAPH_JSON")"

set +e
if [[ $# -eq 0 ]]; then
  graphify update .
else
  graphify update "$@"
fi
GRAPHIFY_EXIT=$?
set -e

AFTER_REPORT="$(fingerprint "$REPORT")"
AFTER_GRAPH="$(fingerprint "$GRAPH_JSON")"

CHANGED=false
[[ "$BEFORE_REPORT" != "$AFTER_REPORT" ]] && CHANGED=true
[[ "$BEFORE_GRAPH" != "$AFTER_GRAPH" ]] && CHANGED=true

if $CHANGED; then
  echo "graphify-update: graph refreshed (report and/or graph.json changed)."
  if [[ $GRAPHIFY_EXIT -ne 0 ]]; then
    echo "graphify-update: ignoring known graphify CLI exit=$GRAPHIFY_EXIT (graph was updated)."
  fi
  exit 0
fi

if [[ $GRAPHIFY_EXIT -ne 0 ]]; then
  echo "graphify-update: graphify exited $GRAPHIFY_EXIT and no graphify-out artifact changed." >&2
  exit 1
fi

echo "graphify-update: no changes detected; graphify exited cleanly."
exit 0
