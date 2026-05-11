#!/usr/bin/env python3
"""Tests for write-a-skill behavior.

Validates that the skill follows its own authoring contract:
- Has YAML frontmatter with name and description
- Has sudo contract block with Inputs, Outputs, Constraints
- Has Workflow section with steps
- Has When to use section
- References skill-template.md
- Review checklist present
"""

import sys
from pathlib import Path

SKILL_DIR = Path(__file__).parent.parent
SKILL_MD = SKILL_DIR / "SKILL.md"
REFS_DIR = SKILL_DIR / "refs"


def test_skill_file_exists():
    assert SKILL_MD.exists(), "SKILL.md must exist"


def test_has_yaml_frontmatter():
    content = SKILL_MD.read_text()
    assert content.startswith("---"), "Must have YAML frontmatter"
    assert "name: write-a-skill" in content, "Frontmatter must have name"
    assert "description:" in content, "Frontmatter must have description"


def test_has_purpose_or_when_to_use():
    content = SKILL_MD.read_text()
    has_when = "## When to use" in content
    has_purpose = "## Purpose" in content or "# Purpose" in content
    assert has_when or has_purpose, "Must have When to use or Purpose section"


def test_has_contract():
    content = SKILL_MD.read_text()
    assert "sudo" in content, "Must have sudo contract block"
    assert "Inputs" in content, "Contract must define Inputs"
    assert "Outputs" in content, "Contract must define Outputs"
    assert "Constraints" in content, "Contract must define Constraints"
    assert "MUST" in content, "Contract must have MUST constraints"


def test_has_workflow():
    content = SKILL_MD.read_text()
    assert "Workflow" in content, "Must have Workflow block"
    assert "gather-requirements" in content, "Workflow must have gather-requirements step"
    assert "draft-skill" in content, "Workflow must have draft-skill step"
    assert "review-with-user" in content, "Workflow must have review-with-user step"
    assert "self_review" in content, "Workflow must have self-review step"


def test_skill_structure_section():
    content = SKILL_MD.read_text()
    assert "## Skill structure" in content or "refs/" in content, (
        "Must document or reference skill structure"
    )
    assert "SKILL.md" in content, "Must reference SKILL.md"


def test_has_review_checklist():
    content = SKILL_MD.read_text()
    refs = SKILL_DIR / "refs"
    guide = refs / "write-a-skill-guide.md"
    has_inline = "## Review checklist" in content
    has_ref = guide.exists() and "Review Checklist" in guide.read_text()
    assert has_inline or has_ref, (
        "Review checklist must be inline or in refs/write-a-skill-guide.md"
    )


def test_refs_exist():
    assert REFS_DIR.exists(), "refs/ directory must exist"
    assert (REFS_DIR / "skill-template.md").exists(), "refs/skill-template.md must exist"


def test_description_routing_section():
    content = SKILL_MD.read_text()
    refs = SKILL_DIR / "refs"
    guide = refs / "write-a-skill-guide.md"
    has_inline = "## Description (routing)" in content or "routing" in content.lower()
    has_ref = guide.exists() and "Routing" in guide.read_text()
    assert has_inline or has_ref, (
        "Routing guidelines must be inline or in refs/write-a-skill-guide.md"
    )


def test_scripts_guidance():
    content = SKILL_MD.read_text()
    assert "Scripts" in content or "scripts" in content, "Must mention scripts"


def run_all():
    tests = [
        test_skill_file_exists,
        test_has_yaml_frontmatter,
        test_has_purpose_or_when_to_use,
        test_has_contract,
        test_has_workflow,
        test_skill_structure_section,
        test_has_review_checklist,
        test_refs_exist,
        test_description_routing_section,
        test_scripts_guidance,
    ]
    passed = 0
    failed = 0
    for test in tests:
        try:
            test()
            passed += 1
            print(f"  PASS: {test.__name__}")
        except AssertionError as e:
            failed += 1
            print(f"  FAIL: {test.__name__}: {e}")
        except Exception as e:
            failed += 1
            print(f"  ERROR: {test.__name__}: {e}")
    print(f"\n{passed}/{passed + failed} tests passed")
    return failed == 0


if __name__ == "__main__":
    success = run_all()
    sys.exit(0 if success else 1)
