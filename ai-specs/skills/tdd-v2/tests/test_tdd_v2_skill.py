"""Characterization tests for tdd-v2 skill.

These tests verify the skill's structure and contract
without modifying behavior.
"""

import json
import re
from pathlib import Path

import yaml

SKILL_DIR = Path(__file__).parent.parent
SKILL_MD = SKILL_DIR / "SKILL.md"
REFS_DIR = SKILL_DIR / "refs"
METRICS_FILE = SKILL_DIR.parent.parent / ".metrics" / "tdd-v2.metrics.json"


def test_skill_md_exists():
    assert SKILL_MD.exists(), "SKILL.md must exist"


def test_frontmatter_valid():
    content = SKILL_MD.read_text()
    match = re.match(r"^---\n(.*?)\n---", content, re.DOTALL)
    assert match, "SKILL.md must have valid YAML frontmatter"
    frontmatter = yaml.safe_load(match.group(1))
    assert frontmatter.get("name") == "tdd-v2"
    assert "description" in frontmatter


def test_has_workflow_section():
    content = SKILL_MD.read_text()
    assert "## Workflows" in content or "## Quick start" in content


def test_has_contract_section():
    content = SKILL_MD.read_text()
    assert "## Contract" in content or "Contracts {" in content


def test_has_constraints():
    content = SKILL_MD.read_text()
    assert "MUST" in content
    assert "NEVER" in content


def test_has_loop_invariant():
    content = SKILL_MD.read_text()
    assert "Loop invariant" in content or "RED" in content


def test_has_gotchas():
    content = SKILL_MD.read_text()
    assert "Gotchas" in content


def test_refs_dir_exists():
    assert REFS_DIR.exists(), "refs/ directory must exist"


def test_refs_tdd_patterns_exists():
    patterns_file = REFS_DIR / "tdd-patterns.md"
    assert patterns_file.exists(), "refs/tdd-patterns.md must exist"


def test_refs_has_aaa_pattern():
    content = (REFS_DIR / "tdd-patterns.md").read_text()
    assert "Arrange-Act-Assert" in content or "AAA" in content


def test_refs_has_bdd_pattern():
    content = (REFS_DIR / "tdd-patterns.md").read_text()
    assert "Given-When-Then" in content or "BDD" in content


def test_has_references_section():
    content = SKILL_MD.read_text()
    assert "References" in content or "Kent Beck" in content


def test_metrics_file_valid():
    assert METRICS_FILE.exists(), "Metrics file must exist"
    data = json.loads(METRICS_FILE.read_text())
    assert "overall_health" in data
    assert "scores" in data
    assert 0 <= data["overall_health"] <= 1


def test_score_above_baseline():
    data = json.loads(METRICS_FILE.read_text())
    assert data["overall_health"] >= 0.81, "Score should be at or above baseline 0.81"
