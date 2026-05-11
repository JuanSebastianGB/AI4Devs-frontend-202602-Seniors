---
name: harness-engineering
description: >
  Assess a codebase's AI-coding agent readiness across 8 pillars and 5 maturity levels,
  then implement a vendor-appropriate harness (CLAUDE.md for Claude Code, AGENTS.md + .cursor/rules/
  for Cursor, .opencode/commands/ for OpenCode). Use when bootstrapping a new project for AI agents,
  improving an existing codebase's agent-readiness, or implementing path-scoped rules, git hooks,
  and enforcement scripts. Covers Cursor rules (.cursor/rules/), Claude Code project memory
  (CLAUDE.md/.claude/), and OpenCode commands (.opencode/commands/) with cross-vendor symlink strategy.
---

# Harness Engineering

## When to use

- Bootstrapping a new project for AI coding agents (Cursor, Claude Code, OpenCode)
- Assessing an existing codebase's readiness for AI agent collaboration
- Implementing AGENTS.md, CLAUDE.md, path-scoped rules, or git hook enforcement
- Improving a codebase's maturity level (bare → basic → enforced → automated → autonomous)
- When user says "harness", "context engineering", "agent setup", or "AI-ready project layout"

## When not to use

- Bug triage on a known codebase (use **triage-issue**)
- Test-first development (use **tdd**)
- Planning a specific feature (use **brainstorming**)
- Multi-agent orchestration design (use **agent-architecture**)

## Multi-Vendor Overview

| Concern | Cursor | Claude Code | OpenCode |
|---------|--------|-------------|----------|
| Project memory | `AGENTS.md` (honored) + `.cursor/rules/*.mdc` | `CLAUDE.md` or `.claude/CLAUDE.md` | `.opencode/` tree + `instructions` in `opencode.json` |
| Skills | `.cursor/skills/<name>/SKILL.md` | `.claude/skills/<name>/SKILL.md` | `.opencode/skills/<name>/SKILL.md` |
| Rules | `.cursor/rules/*.mdc` | N/A (uses CLAUDE.md) | consumed via `instructions` globs |
| Agents | subagents via rules | `.claude/agents/*.md` | `agents` in `opencode.json` |
| MCP | `.cursor/mcp.json` | `.claude/mcp.json` | `mcp` in `opencode.json` |

**Cross-vendor strategy:** Keep one canonical spec in `AGENTS.md` at repo root. Generate or symlink vendor-specific stubs so Cursor, Claude Code, and OpenCode stay in sync on semantics. See `refs/platforms-cursor-claude-opencode.md` for details.

## Contract

```sudo
Contracts {
  Inputs {
    codebase_path?: string           # absolute path, defaults to current directory
    target_maturity?: int            # desired maturity level (1-5), default 3 (enforced)
    stack?: string                  # tech stack hint (node, python, go, rust, etc.)
    vendors?: List["cursor" | "claude" | "opencode"]  # target vendors, default all 3
  }
  Outputs {
    readiness_report: {
      maturity_level: int          # 1-5
      maturity_name: string         # "Bare" | "Basic" | "Enforced" | "Automated" | "Autonomous"
      pillar_scores: Map[string, PillarScore]
      overall_readiness: float      # 0.0 - 1.0
      gaps: List[string]            # prioritized gap list
      quick_wins: List[string]     # easy wins to reach target maturity
    }
    implemented_artifacts: List[string]  # files created/modified
    suggested_layout: {
      vendor_artifacts: Map[vendor, VendorLayout]
    }
  }
  Constraints {
    MUST: "assess all 8 pillars before suggesting layout"
    MUST: "produce a maturity level (1-5) with evidence for each pillar"
    MUST: "implement only what the target maturity level requires — no gold-plating"
    MUST: "use agentic subagents for parallel exploration of codebase perspectives"
    MUST: "create enforceable artifacts (hooks, rules) not just advisory documentation"
    MUST: "produce vendor-specific outputs (CLAUDE.md for Claude Code, AGENTS.md + .cursor/rules for Cursor, .opencode/commands for OpenCode)"
    SHOULD: "prioritize quick wins that cost little but unlock large readiness gains"
    SHOULD: "respect existing project conventions when implementing harnesses"
    SHOULD: "recommend symlink strategy when a single artifact serves multiple vendors"
    NEVER: "overwrite existing AGENTS.md or CLAUDE.md without backing up first"
    NEVER: "implement full autonomous harness (level 5) unless explicitly requested"
  }
}

VendorLayout {
  global_md: string?       # path to global project memory
  rules: List[string]      # path-scoped rules
  hooks: List[string]      # git hooks to implement
  scripts: List[string]    # enforcement scripts
  config: string?          # vendor config file (e.g. .claude/settings.json)
}

PillarScore {
  score: int           # 0-10
  evidence: List[string]
  gaps: List[string]
  maturity_indicator: string
}
```

## 8 Evaluation Pillars

| # | Pillar | Checks | Maturity Indicator |
|---|--------|-------|-------------------|
| 1 | **Style & Validation** | Linter present, formatter present, lint-on-commit, no default exports | Config files exist and are enforced |
| 2 | **Testing** | Test runner, colocation, coverage, TDD enforcement | Tests exist and run on push |
| 3 | **Git Hooks & Enforcement** | Pre-commit, pre-push, secret scanning, file size limits, smart caching | Hooks block violations mechanically |
| 4 | **Documentation** | AGENTS.md/CLAUDE.md quality: commands, architecture, gotchas, AUTO sections, drift detection | Project memory exists with essential sections |
| 5 | **Agent Configuration** | Vendor-specific settings, allow/deny lists, path-scoped rules, enforcement hierarchy | Cursor: `.cursor/settings.json`; Claude: `.claude/settings.json`; OpenCode: `opencode.json` configured |
| 6 | **Code Quality** | File size limits (300 lines), secret scanning, consistent style | Enforcement scripts exist |
| 7 | **Dev Environment** | .env.example, build commands, dependency health | Setup scripts exist |
| 8 | **Agentic Workflow** | Planning system (BMAD, Superpowers, etc.), plan-before-build, session-start validation | Workflow installed and active |

## 5 Maturity Levels

| Level | Name | Definition | What's Present |
|-------|------|-----------|----------------|
| 1 | **Bare** | Has manifest + git. That's it. | `package.json` / `go.mod` / `Cargo.toml` + `.git/` |
| 2 | **Basic** | Linter + formatter + test runner exist and work. | Configs for ESLint/Prettier/Pytest present and passing |
| 3 | **Enforced** | Git hooks block bad commits. AGENTS.md/CLAUDE.md exists with essential sections. Vendor settings configured. | Pre-commit + pre-push hooks, project memory, vendor config |
| 4 | **Automated** | Auto-generated docs, drift detection, path-scoped rules, smart test caching. Agentic workflow installed. | AUTO markers, validate-docs script, vendor rules/, workflow plugin |
| 5 | **Autonomous** | Full harness coverage. TDD enforced. Docs in sync. Plan-before-build + session-start validation. | Everything at level 4 + TDD enforcement + session-start checks |

## Workflow

```
sudo
workflow:
  name: "harness-engineering"
  description: "Assess codebase readiness, then implement vendor-appropriate harness layout"
  goals:
    - "Explore codebase structure via parallel subagents"
    - "Score all 8 pillars and compute maturity level"
    - "Identify gaps and quick wins to reach target maturity"
    - "Implement suggested layout for all target vendors"
    - "Verify implemented harness works"
  steps:
    - id: "explore_codebase"
      description: "Run 3 parallel subagents: (1) Tech Stack & Structure, (2) Quality & Enforcement, (3) Documentation & Vendor Config"
      action_type: "agent"
      parallel: true
      outputs:
        - name: "tech_stack_findings"
          type: "object"
        - name: "quality_findings"
          type: "object"
        - name: "workflow_findings"
          type: "object"

    - id: "assess_pillars"
      description: "Score all 8 pillars using subagent findings + direct inspection"
      action_type: "reason"
      inputs: ["tech_stack_findings", "quality_findings", "workflow_findings"]
      outputs:
        - name: "pillar_scores"
          type: "Map[string, PillarScore]"
        - name: "maturity_level"
          type: "int"

    - id: "identify_gaps"
      description: "Compute gaps, quick wins, and target layout based on maturity gap"
      action_type: "reason"
      inputs: ["pillar_scores", "target_maturity"]
      outputs:
        - name: "gaps"
          type: "List[string]"
        - name: "quick_wins"
          type: "List[string]"
        - name: "layout_plan"
          type: "object"

    - id: "implement_harness"
      description: "Create AGENTS.md, CLAUDE.md, .cursor/rules/, .opencode/commands/, hooks, and scripts for target maturity and vendors"
      action_type: "agent"
      inputs: ["layout_plan", "stack", "vendors"]
      outputs:
        - name: "implemented_artifacts"
          type: "List[string]"

    - id: "verify_harness"
      description: "Run git hook dry-run and project memory validation to confirm harness is active"
      action_type: "bash"
      inputs: ["implemented_artifacts"]
      outputs:
        - name: "verification_results"
          type: "object"
```

## Step Details

### 1. explore_codebase

Run 3 parallel subagents, each with a distinct focus:

| Subagent | Focus | Probes |
|----------|-------|--------|
| **tech_stack** | Languages, frameworks, entry points, build tooling | Detect lockfiles, test runners, linters, formatters, CI/CD |
| **quality** | Existing enforcement, git hooks, config quality | Check `.git/hooks/`, `package.json` scripts, ESLint/Prettier/TES config |
| **workflow** | Documentation, vendor config, planning tools | Check AGENTS.md, CLAUDE.md, `.cursor/`, `.claude/`, `.opencode/`, `docs/` |

### 2. assess_pillars

Score each pillar 0-10 with evidence. Compute maturity level as weighted average:
- Pillar 1 (Style): weight 1.0
- Pillar 2 (Testing): weight 1.5 (critical for agent reliability)
- Pillar 3 (Hooks): weight 1.5 (mechanical enforcement is the core unlock)
- Pillar 4 (Docs): weight 1.0
- Pillar 5 (Agent Config): weight 1.0
- Pillar 6 (Code Quality): weight 1.0
- Pillar 7 (Dev Env): weight 0.5
- Pillar 8 (Workflow): weight 1.0

Maturity level thresholds:
- Level 1 (Bare): overall < 2.0
- Level 2 (Basic): overall >= 2.0, has linter + formatter + test runner
- Level 3 (Enforced): overall >= 4.0, has pre-commit + project memory (AGENTS.md or CLAUDE.md)
- Level 4 (Automated): overall >= 6.0, has AUTO markers + rules + workflow
- Level 5 (Autonomous): overall >= 8.0, has TDD + session validation

### 3. identify_gaps

Compare current maturity to target. List gaps in priority order:
1. Mechanical enforcement gaps (hooks, linters) — these are non-negotiable
2. Documentation gaps (AGENTS.md/CLAUDE.md, rules)
3. Workflow gaps (planning, TDD)

Quick wins (one-file additions):
- Add `.gitignore` with standard ignores
- Add `AGENTS.md` with essential sections (serves Cursor + OpenCode)
- Add `CLAUDE.md` with essential sections (serves Claude Code)
- Add `.claude/settings.json` with allow/deny lists
- Add pre-commit hook for lint

### 4. implement_harness

Implement artifacts based on target maturity level and vendor:

**Level 2 (Basic)** — all vendors:
- Linter config (`.eslintrc`, `pyproject.toml`, etc.)
- Formatter config (`.prettierrc`, `rustfmt.toml`, etc.)
- `package.json` scripts: `lint`, `format`, `test`
- Test runner (Jest, Pytest, etc.)

**Level 3 (Enforced)** — per vendor:

| Vendor | Project Memory | Config | Rules |
|--------|---------------|--------|-------|
| Cursor | `AGENTS.md` | `.cursor/settings.json` | `.cursor/rules/*.mdc` |
| Claude Code | `CLAUDE.md` | `.claude/settings.json` | N/A |
| OpenCode | `AGENTS.md` (via instructions) | `opencode.json` | consumed from `.cursor/rules/*.md` |

- `.git/hooks/pre-commit`
- `.git/hooks/pre-push`
- `scripts/check-secrets.js`
- `scripts/check-file-sizes.js`

**Level 4 (Automated)** — per vendor:

| Vendor | Path-Scoped Rules |
|--------|------------------|
| Cursor | `.cursor/rules/tdd.md`, `.cursor/rules/file-size.md` |
| Claude Code | Embedded in `CLAUDE.md` sections |
| OpenCode | `.opencode/commands/tdd.md`, `.opencode/commands/file-size.md` |

- `scripts/generate-docs.js`
- `scripts/validate-docs.js`
- AUTO markers in AGENTS.md/CLAUDE.md
- Planning workflow (Superpowers or BMAD)

**Level 5 (Autonomous)**:
- TDD enforcement in project memory
- Session-start validation
- Adversarial review integration

### 5. verify_harness

```bash
# Verify pre-commit hook exists and is executable
ls -la .git/hooks/pre-commit

# Dry-run lint to confirm config is valid
npm run lint --dry-run 2>/dev/null || echo "lint: not configured"

# Verify project memory has required sections
grep -E "^## (Commands|Architecture|Gotchas|Docs Map)" AGENTS.md CLAUDE.md 2>/dev/null

# Verify vendor configs are valid JSON
python3 -c "import json; json.load(open('.claude/settings.json'))" 2>/dev/null
python3 -c "import json; json.load(open('opencode.json'))" 2>/dev/null
```

## Layout Templates

### AGENTS.md (Global - Level 3) — serves Cursor + OpenCode

```markdown
# AGENTS.md — Project Agent Standards

## Operating Principles

- **TDD First**: Write failing tests before any code. Red-Green-Refactor always.
- **Mechanical Enforcement**: Git hooks block violations. Linters write the law.
- **Finite Attention**: Keep files under 300 lines. Use progressive disclosure.
- **Map Not Manual**: Index structure, don't encyclopedize it.

## Quality Gates (pre-commit blocks on violation)

1. Lint passes (`npm run lint`)
2. No secrets committed (API keys, tokens, private keys)
3. No files over 300 lines
4. Tests colocated with source

## Quality Gates (pre-push blocks on violation)

1. All tests pass (`npm test`)
2. Coverage maintained or improved

## What to Include in Project AGENTS.md

- Architecture diagram or structure overview
- Essential commands (dev, build, test, deploy)
- Directory structure
- Module index
- Critical gotchas
- Docs Map linking to detail docs

## What NOT to Include

- Restatements of linter rules (linter enforces these)
- Generic best practices the agent already knows
- More than 300 lines total
```

### CLAUDE.md (Global - Level 3) — serves Claude Code

```markdown
# CLAUDE.md — [Project Name]

## Architecture

<!-- AUTO:tree -->
```
[Directory tree auto-generated on commit]
```
<!-- /AUTO:tree -->

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm test` | Run all tests |
| `npm run lint` | Lint and fix formatting |

## Docs Map

| Topic | File |
|-------|------|
| Testing strategy | docs/testing.md |
| Configuration | docs/configuration.md |

## Gotchas

- [Specific gotcha 1]
- [Specific gotcha 2]
```

### Cursor Path-Scoped Rules (`.cursor/rules/`)

**`tdd.md`**:
```markdown
---
name: TDD Enforcement
globs: ["src/**/*.ts", "src/**/*.js", "lib/**/*.py"]
---
## TDD Enforcement

- ALWAYS write failing test BEFORE implementing feature
- Test file lives alongside source: `src/foo.ts` → `tests/src/foo.test.ts`
- Red-Green-Refactor cycle: FAIL → PASS → REFACTOR
- Never skip the REFACTOR step
```

**`file-size.md`**:
```markdown
---
name: File Size Limit
globs: ["src/**/*.ts", "src/**/*.js", "lib/**/*.py", "src/**/*.tsx"]
---
## File Size Limit

- HARD LIMIT: 300 lines per file
- If file exceeds 300 lines, decompose into smaller modules
- Exception: Auto-generated files (mark with `<!-- AUTO: -->`)
```

### OpenCode Commands (`.opencode/commands/`)

**`tdd.md`**:
```markdown
# TDD Enforcement

When working on src/** files:

- ALWAYS write failing test BEFORE implementing feature
- Test file lives alongside source: `src/foo.ts` → `tests/src/foo.test.ts`
- Red-Green-Refactor cycle: FAIL → PASS → REFACTOR
```

### Pre-commit Hook Template

```bash
#!/bin/bash
set -e
echo "Running pre-commit checks..."
if [ -f "package.json" ]; then
  npm run lint --silent && echo "✓ Lint passed" || { echo "✗ Lint failed"; exit 1; }
fi
if [ -f "scripts/check-secrets.js" ]; then
  node scripts/check-secrets.js && echo "✓ No secrets detected" || { echo "✗ Secrets detected"; exit 1; }
fi
if [ -f "scripts/check-file-sizes.js" ]; then
  node scripts/check-file-sizes.js && echo "✓ File sizes OK" || { echo "✗ File too large"; exit 1; }
fi
echo "✓ Pre-commit checks passed"
```

### Pre-push Hook Template

```bash
#!/bin/bash
set -e
echo "Running pre-push checks..."
if [ -f "package.json" ]; then
  npm test && echo "✓ Tests passed" || { echo "✗ Tests failed"; exit 1; }
fi
echo "✓ Pre-push checks passed"
```

## References

- `refs/harness-reference.md` — full best practices, maturity checklists, enforcement scripts
- `refs/platforms-cursor-claude-opencode.md` — vendor-specific conventions from agent-architecture skill
- [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/)
- [Anthropic Harness Design](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- [Factory.ai Agent Readiness](https://factory.ai/news/agent-readiness) — 8 pillars, 5 maturity levels
- [Andrej Karpathy on Context Engineering](https://x.com/karpathy/status/1937902205765607626)
- [Superpowers Plugin](https://github.com/obra/superpowers) — Brainstorm → plan → TDD → subagent execution workflow
- [BMAD Method](https://github.com/bmad-code-org/BMAD-METHOD) — Full-lifecycle agentic framework

## Output Format

After assessment, output:

```
## Harness Readiness Report

**Current Maturity**: Level N — [Name]
**Target Maturity**: Level N — [Name]
**Overall Readiness**: XX%

### Pillar Scores
| Pillar | Score | Status |
|--------|-------|--------|
| Style & Validation | X/10 | ●●●○○ |
| Testing | X/10 | ●●●○○ |
| Git Hooks | X/10 | ●●●○○ |
| Documentation | X/10 | ●●○○○ |
| Agent Config | X/10 | ●○○○○ |
| Code Quality | X/10 | ●●●○○ |
| Dev Environment | X/10 | ●●○○○ |
| Agentic Workflow | X/10 | ○○○○○ |

### Vendor Coverage
| Vendor | Project Memory | Config | Rules |
|--------|---------------|--------|-------|
| Cursor | AGENTS.md | .cursor/settings.json | .cursor/rules/*.mdc |
| Claude Code | CLAUDE.md | .claude/settings.json | (in CLAUDE.md) |
| OpenCode | AGENTS.md | opencode.json | .opencode/commands/ |

### Gaps (Priority Order)
1. [Gap 1 — blocks reaching Level N]
2. [Gap 2]

### Quick Wins
- [One-file addition that unlocks X% readiness]

### Suggested Layout
```
[Tree of files to create per vendor]
```

Shall I implement the harness at Level N (target maturity)?
```
