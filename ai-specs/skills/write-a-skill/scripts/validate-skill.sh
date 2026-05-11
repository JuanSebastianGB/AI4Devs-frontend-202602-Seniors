#!/bin/bash
# validate-skill.sh — Validate a skill SKILL.md meets authoring standards
set -e

SKILL_MD="${1:-}"

if [[ -z "$SKILL_MD" ]]; then
  echo "Usage: $0 <path-to-SKILL.md>"
  exit 1
fi

if [[ ! -f "$SKILL_MD" ]]; then
  echo "ERROR: $SKILL_MD not found"
  exit 1
fi

ERRORS=0

check_frontmatter() {
  if ! head -1 "$SKILL_MD" | grep -q "^---"; then
    echo "FAIL: Missing YAML frontmatter"
    ERRORS=$((ERRORS + 1))
  fi
}

check_description() {
  DESC_LEN=$(sed -n '/^description:/,/^---/p' "$SKILL_MD" | head -20 | wc -c)
  if [[ $DESC_LEN -lt 50 ]]; then
    echo "FAIL: Description too short (< 50 chars)"
    ERRORS=$((ERRORS + 1))
  fi
}

check_contract() {
  if ! grep -q "sudo" "$SKILL_MD"; then
    echo "FAIL: Missing sudo contract block"
    ERRORS=$((ERRORS + 1))
  fi
  if ! grep -q "Inputs" "$SKILL_MD"; then
    echo "FAIL: Missing Inputs in contract"
    ERRORS=$((ERRORS + 1))
  fi
  if ! grep -q "Outputs" "$SKILL_MD"; then
    echo "FAIL: Missing Outputs in contract"
    ERRORS=$((ERRORS + 1))
  fi
  if ! grep -q "Constraints" "$SKILL_MD"; then
    echo "FAIL: Missing Constraints in contract"
    ERRORS=$((ERRORS + 1))
  fi
}

check_workflow() {
  if ! grep -q "Workflow" "$SKILL_MD"; then
    echo "FAIL: Missing Workflow block"
    ERRORS=$((ERRORS + 1))
  fi
}

check_when_to_use() {
  if ! grep -qE "## When to use|## Purpose" "$SKILL_MD"; then
    echo "FAIL: Missing When to use or Purpose section"
    ERRORS=$((ERRORS + 1))
  fi
}

check_frontmatter
check_description
check_contract
check_workflow
check_when_to_use

if [[ $ERRORS -eq 0 ]]; then
  echo "PASS: All validation checks passed"
  exit 0
else
  echo "FAIL: $ERRORS validation errors"
  exit 1
fi