#!/usr/bin/env python3
"""Validate improve-codebase-architecture skill fixtures against SKILL.md."""

import sys
from pathlib import Path

SKILL_PATH = Path(__file__).parent.parent / "SKILL.md"
FIXTURES_PATH = Path(__file__).parent.parent / "fixtures"


def main():
    content = SKILL_PATH.read_text()
    all_passed = True

    required_phrases = FIXTURES_PATH / "required-phrases.txt"
    for line in required_phrases.read_text().splitlines():
        line = line.strip()
        if line.startswith("#") or not line:
            continue
        if line.lower() not in content.lower():
            print(f"FAIL: required phrase not found: {line}")
            all_passed = False

    workflow_tokens = FIXTURES_PATH / "workflow-step-tokens.txt"
    for line in workflow_tokens.read_text().splitlines():
        line = line.strip()
        if line.startswith("#") or not line:
            continue
        if line not in content:
            print(f"FAIL: workflow token not found: {line}")
            all_passed = False

    skill_signals = FIXTURES_PATH / "skill-only-signal-phrases.txt"
    for line in skill_signals.read_text().splitlines():
        line = line.strip()
        if line.startswith("#") or not line:
            continue
        if line not in content:
            print(f"FAIL: skill signal phrase not found: {line}")
            all_passed = False

    rfc_order = FIXTURES_PATH / "rfc-template-section-order.txt"
    refs_content = (SKILL_PATH.parent / "refs" / "deepening-reference.md").read_text()
    positions = {}
    for line in rfc_order.read_text().splitlines():
        line = line.strip()
        if line.startswith("#") or not line or not line.startswith("##"):
            continue
        pos = refs_content.find(line)
        if pos == -1:
            print(f"FAIL: RFC section not found in deepening-reference.md: {line}")
            all_passed = False
        else:
            positions[line] = pos
    prev_pos = -1
    for heading, pos in sorted(positions.items(), key=lambda x: x[1]):
        if pos < prev_pos:
            print(f"FAIL: RFC sections out of order: {heading}")
            all_passed = False
        prev_pos = pos

    deepening_shape = FIXTURES_PATH / "deepening-candidate-shape.json"
    import json

    shape = json.loads(deepening_shape.read_text())
    for field in shape["required_fields"]:
        if field not in content:
            print(f"FAIL: deepening candidate field not found: {field}")
            all_passed = False

    if all_passed:
        print("All fixture validations passed.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
