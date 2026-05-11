#!/usr/bin/env python3
"""Smoke tests for improve-codebase-architecture skill routing and structure."""

from pathlib import Path

SKILL_PATH = Path(__file__).parent.parent / "SKILL.md"
FIXTURES_PATH = Path(__file__).parent.parent / "fixtures"


def test_skill_file_exists():
    assert SKILL_PATH.exists(), "SKILL.md must exist"


def test_when_to_use_triggers():
    content = SKILL_PATH.read_text()
    assert "## When to use" in content
    assert "Refactoring or consolidating tightly coupled modules" in content
    assert "Raising testability" in content
    assert "Surfacing architectural friction" in content
    assert "Turning shallow, wide interfaces" in content
    assert "Making large codebases easier for AI agents" in content


def test_when_not_to_use_exclusions():
    content = SKILL_PATH.read_text()
    assert "## When not to use" in content
    assert "Greenfield work" in content
    assert "Cosmetic or formatting-only churn" in content
    assert "Emergency hotfixes" in content


def test_contracts_block():
    content = SKILL_PATH.read_text()
    assert "```sudo" in content
    assert "Contracts {" in content
    assert "Inputs {" in content
    assert "Outputs {" in content
    assert "Constraints {" in content
    assert "exploration_notes" in content
    assert "deepening_candidates" in content
    assert "github_issue_url" in content


def test_workflow_steps():
    content = SKILL_PATH.read_text()
    assert "Workflow {" in content
    assert "step1_explore_codebase_prefer_graph_fallback_to_explore_subagent" in content
    assert "step7_create_github_rfc_issue_via_gh_cli_share_url" in content
    assert "at least three Agent" in content


def test_graph_first_exploration():
    content = SKILL_PATH.read_text()
    assert "get_architecture_overview" in content
    assert "list_communities" in content
    assert "get_hub_nodes" in content
    assert "get_bridge_nodes" in content


def test_shell_quoting_gotcha():
    content = SKILL_PATH.read_text()
    assert "--body-file" in content
    assert "unmatched" in content


def test_rfc_before_code_gate():
    content = SKILL_PATH.read_text()
    assert "RFC-before-code gate" in content
    assert "Agent tool must not be used for implementation" in content


def test_fixture_required_phrases():
    phrases = FIXTURES_PATH / "required-phrases.txt"
    content = SKILL_PATH.read_text()
    skill_lower = content.lower()
    for line in phrases.read_text().splitlines():
        line = line.strip()
        if line.startswith("#") or not line:
            continue
        assert line.lower() in skill_lower, f"Required phrase not found: {line}"


def test_fixture_workflow_tokens():
    tokens = FIXTURES_PATH / "workflow-step-tokens.txt"
    content = SKILL_PATH.read_text()
    for line in tokens.read_text().splitlines():
        line = line.strip()
        if line.startswith("#") or not line:
            continue
        assert line in content, f"Workflow token not found in SKILL.md: {line}"


def test_fixture_skill_only_signals():
    signals = FIXTURES_PATH / "skill-only-signal-phrases.txt"
    content = SKILL_PATH.read_text()
    for line in signals.read_text().splitlines():
        line = line.strip()
        if line.startswith("#") or not line:
            continue
        assert line in content, f"Signal phrase not found in SKILL.md: {line}"


def test_verification_checklist():
    content = SKILL_PATH.read_text()
    assert "## Verification" in content
    assert "Step 1 surfaced friction" in content
    assert "Step 7 created GitHub RFC issue" in content


def test_red_flags():
    content = SKILL_PATH.read_text()
    assert "## Red Flags" in content
    assert "Agent tool used for code writing" in content
    assert "Interface proposals appearing in the deepening candidates list" in content


def test_common_rationalizations():
    content = SKILL_PATH.read_text()
    assert "## Common Rationalizations" in content
    assert "Rationalization" in content
    assert "Reality" in content


if __name__ == "__main__":
    import pytest

    pytest.main([__file__, "-v"])
