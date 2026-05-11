# Harness Engineering Reference

## Core Principle: Mechanical Enforcement Over Prose

From Andrej Karpathy (who coined "context engineering"):
> "The agents do not listen to my instructions." They bloat abstractions, copy-paste code blocks, and ignore style guidance, no matter how carefully you write AGENTS.md.

**The answer isn't better prompting. It's mechanical enforcement:**
- Git hooks block bad code before it lands
- Linters catch what instructions can't
- Path-scoped rules load only when relevant

## Multi-Vendor Conventions

| Concern | Cursor | Claude Code | OpenCode |
|---------|--------|-------------|----------|
| Project memory | `AGENTS.md` (root, honored) + `.cursor/rules/*.mdc` | `CLAUDE.md` or `.claude/CLAUDE.md` | `.opencode/` tree + `instructions` in `opencode.json` |
| Path-scoped rules | `.cursor/rules/*.mdc` | N/A (rules embedded in CLAUDE.md) | consumed via `instructions` globs from Cursor rules |
| Vendor config | `.cursor/settings.json` | `.claude/settings.json` | `opencode.json` |
| Skills | `.cursor/skills/<name>/SKILL.md` | `.claude/skills/<name>/SKILL.md` | `.opencode/skills/<name>/SKILL.md` |

**Strategy:** Keep one canonical `AGENTS.md` at repo root (serves Cursor + OpenCode). Create `CLAUDE.md` for Claude Code. Symlink or generate vendor stubs to avoid drift. See `refs/platforms-cursor-claude-opencode.md` from agent-architecture skill for details.

## Key Sources

| Source | Key Contribution |
|--------|-----------------|
| [OpenAI Harness Engineering](https://openai.com/index/harness-engineering/) | Built product with 1M+ lines using Codex with zero manually-written code. Maps, not manuals. |
| [Anthropic Harness Design](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Generator-Evaluator pattern (GAN-inspired), context resets, sprint contracts |
| [jrenaldi79/harness-engineering](https://github.com/jrenaldi79/harness-engineering) | CLAUDE.md templates, 20+ best practices, readiness assessment |
| [walkinglabs/learn-harness-engineering](https://walkinglabs.github.io/learn-harness-engineering/en/resources/templates/) | AGENTS.md, init.sh, feature_list.json, session-handoff.md templates |
| [Factory.ai Agent Readiness](https://factory.ai/news/agent-readiness) | 8 pillars, 5 maturity levels, automated remediation |
| [Augment Code — Context is a Junk Drawer](https://www.augmentcode.com/blog/your-agents-context-is-a-junk-drawer) | ETH Zurich research: context files REDUCE task success rates while increasing cost 20%+ |
| [Boris Cherny (Claude Code creator)](https://newsletter.pragmaticengineer.com/p/building-claude-code-with-boris-cherny) | Subagent dispatch over swarms, git worktrees, codified workflows |
| [Jesse Vincent — Superpowers](https://github.com/obra/superpowers) | Compliance beats comprehension, brainstorming → plan → TDD workflow |

## Best Practice Mapping

| Best Practice | Sources | Implementation |
|---------------|---------|----------------|
| Map not manual | OpenAI, Augment, Willison | 200-300 line AGENTS.md/CLAUDE.md as index |
| Index over encyclopedia | OpenAI, Augment | Compress 40KB docs → 8KB index, 100% pass rate |
| Progressive disclosure | OpenAI, Augment, Thariq | 3 tiers: AGENTS.md/CLAUDE.md, docs/, docs/plans/ |
| Finite attention budget | Augment, Karpathy, Anthropic | 200-300 line targets, constraint density |
| Failure-backed rules only | Augment, Willison, DHH | Only rules that prevent mistakes |
| Repository as system of record | OpenAI, Augment, Thariq | What agent can't see doesn't exist |
| Linters over instructions | Augment, OpenAI, Factory.ai | Automated checks > prose |
| TDD required | All practitioners | Red-Green-Refactor enforced |
| Spec-driven development | Thariq, Boris | Plan before build |
| Subagent dispatch over swarms | Boris, Vincent | Clean context, no crosstalk |

## Maturity Level Implementation Checklist

### Level 1 — Bare
- [ ] Git repo initialized
- [ ] Package manifest exists (`package.json`, `go.mod`, `Cargo.toml`, etc.)

### Level 2 — Basic
- [ ] Linter configured (ESLint, Pylint, clippy, etc.)
- [ ] Formatter configured (Prettier, black, rustfmt, etc.)
- [ ] Test runner configured and working (Jest, pytest, cargo test, etc.)
- [ ] `npm run lint` passes
- [ ] `npm test` passes

### Level 3 — Enforced
- [ ] Project memory exists (at least one of):
  - [ ] `AGENTS.md` (serves Cursor + OpenCode)
  - [ ] `CLAUDE.md` (serves Claude Code)
  - [ ] With: Architecture overview, Essential commands, Gotchas, Docs Map
- [ ] Vendor config exists (all that apply):
  - [ ] `.cursor/settings.json` with allow/deny lists (Cursor)
  - [ ] `.claude/settings.json` with allow/deny lists (Claude Code)
  - [ ] `opencode.json` configured (OpenCode)
- [ ] `.git/hooks/pre-commit`:
  - [ ] Lint check
  - [ ] Secret scan
  - [ ] File size check
- [ ] `.git/hooks/pre-push`:
  - [ ] Test runner
- [ ] `scripts/check-secrets.js`
- [ ] `scripts/check-file-sizes.js`

### Level 4 — Automated
- [ ] Path-scoped rules (Cursor):
  - [ ] `.cursor/rules/tdd.md` (activates on `src/**`)
  - [ ] `.cursor/rules/file-size.md` (activates on `**/*.ts`, `**/*.js`)
  - [ ] `.cursor/rules/testing.md` (activates on `tests/**`)
  - [ ] `.cursor/rules/typescript.md` (activates on `**/*.ts`, `**/*.tsx`)
- [ ] OpenCode consumes Cursor rules via `instructions` globs in `opencode.json`:
  ```json
  { "instructions": [".cursor/rules/*.md"] }
  ```
- [ ] `scripts/generate-docs.js` with AUTO markers
- [ ] `scripts/validate-docs.js` for drift detection
- [ ] Agentic workflow installed (Superpowers or BMAD)
- [ ] `npm run generate-docs` on pre-commit

### Level 5 — Autonomous
- [ ] TDD strictly enforced in project memory (AGENTS.md + CLAUDE.md)
- [ ] Session-start validation (verify baseline works)
- [ ] Adversarial review integration
- [ ] Planning before every build

## Enforcement Scripts Reference

### check-secrets.js

```javascript
const fs = require('fs');
const path = require('path');

const SECRET_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,           // OpenAI keys
  /ghp_[a-zA-Z0-9]{36}/,           // GitHub tokens
  /AIza[a-zA-Z0-9_-]{35}/,         // Google API keys
  /[a-zA-Z0-9]{32}\.env/,          // Generic secrets
  /password\s*=\s*['"][^'"]+['"]/i, // Password assignments
];

const stagedFiles = process.argv.slice(2);

for (const file of stagedFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      console.error(`✗ Secret detected in ${file}`);
      process.exit(1);
    }
  }
}
console.log('✓ No secrets detected');
```

### check-file-sizes.js

```javascript
const fs = require('fs');
const path = require('path');

const MAX_LINES = 300;
const IGNORE_PATTERNS = ['node_modules/', '.git/', 'dist/', 'build/', '<!-- AUTO:'];

const stagedFiles = process.argv.slice(2);
let hasViolation = false;

for (const file of stagedFiles) {
  const shouldIgnore = IGNORE_PATTERNS.some(p => file.includes(p));
  if (shouldIgnore) continue;

  const lines = fs.readFileSync(file, 'utf8').split('\n').length;
  if (lines > MAX_LINES) {
    console.error(`✗ ${file}: ${lines} lines (max ${MAX_LINES})`);
    hasViolation = true;
  }
}

if (hasViolation) {
  console.error('Files exceed line limit. Decompose into smaller modules.');
  process.exit(1);
}
console.log(`✓ All files under ${MAX_LINES} lines`);
```

### check-test-colocation.js

```javascript
const fs = require('fs');
const path = require('path');

const srcDir = 'src';
const testDir = 'tests';

const stagedFiles = process.argv.slice(2)
  .filter(f => f.startsWith(srcDir + '/') && !f.includes('.test.'));

let hasViolation = false;

for (const file of stagedFiles) {
  const relative = path.relative(srcDir, file);
  const ext = path.extname(relative);
  const basename = path.basename(relative, ext);
  const testFile = path.join(testDir, relative.replace(ext, '.test' + ext));

  if (!fs.existsSync(testFile)) {
    console.error(`✗ No colocated test for ${file}`);
    hasViolation = true;
  }
}

if (hasViolation) {
  process.exit(1);
}
console.log('✓ All source files have colocated tests');
```

## Path-Scoped Rules Format

**Cursor rules** live in `.cursor/rules/` and use YAML frontmatter:

```markdown
---
name: TDD Enforcement
globs: ["src/**/*.ts", "src/**/*.tsx", "lib/**/*.js"]
---
## Rule Name

Rule content — what to do when working on matching files.
Use bullet points for specific behaviors.
```

**Claude Code** does not have path-scoped rules. Embed rule enforcement directly in CLAUDE.md sections with clear headers.

**OpenCode** consumes Cursor rules via the `instructions` array in `opencode.json`:
```json
{
  "instructions": [".cursor/rules/*.md"]
}
```

### Rule Priority (Cursor)

When multiple rules match, they apply in order:
1. Project AGENTS.md (loaded every conversation)
2. `.cursor/rules/*.mdc` (loaded when glob matches current file)
3. Docs in `docs/` (on demand via Docs Map links)

## AUTO Markers

```markdown
<!-- AUTO:tree -->
[Content regenerates on pre-commit]
<!-- /AUTO:tree -->

<!-- AUTO:modules -->
[Module list regenerates on pre-commit]
<!-- /AUTO:modules -->
```

## Templates for New Projects

### Minimal AGENTS.md (Level 3) — serves Cursor + OpenCode

```markdown
# AGENTS.md — [Project Name]

## Architecture

<!-- AUTO:tree -->
```
[Auto-generated tree]
```
<!-- /AUTO:tree -->

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm test` | Run tests |
| `npm run lint` | Lint and fix |

## Gotchas

- [Project-specific gotcha 1]
- [Project-specific gotcha 2]

## Docs Map

| Topic | Location |
|-------|----------|
| Testing | docs/testing.md |
| Config | docs/config.md |
```

### Minimal CLAUDE.md (Level 3) — serves Claude Code

```markdown
# [Project Name]

## Architecture

```
[Auto-generated tree]
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm test` | Run tests |
| `npm run lint` | Lint and fix |

## Gotchas

- [Project-specific gotcha 1]
- [Project-specific gotcha 2]

## Docs Map

| Topic | Location |
|-------|----------|
| Testing | docs/testing.md |
| Config | docs/config.md |
```

### Global AGENTS.md (shared across projects) — Cursor + OpenCode

```markdown
# Global Agent Standards

## Operating Principles

1. **TDD First**: Write failing tests before any code
2. **Mechanical Enforcement**: Git hooks block violations
3. **Finite Attention**: Keep files under 300 lines
4. **Map Not Manual**: Index structure, don't encyclopedize

## Quality Gates

- Pre-commit: lint + secret scan + file sizes
- Pre-push: all tests pass

## What NOT to Include

- Restatements of linter rules
- Generic best practices
- More than 300 lines
```

### Global CLAUDE.md (shared across projects) — Claude Code

```markdown
# Global Agent Standards

## Operating Principles

1. **TDD First**: Write failing tests before any code
2. **Mechanical Enforcement**: Git hooks block violations
3. **Finite Attention**: Keep files under 300 lines
4. **Map Not Manual**: Index structure, don't encyclopedize

## Quality Gates

- Pre-commit: lint + secret scan + file sizes
- Pre-push: all tests pass

## What NOT to Include

- Restatements of linter rules
- Generic best practices
- More than 300 lines
```

## Agent Workflow Integration

### Superpowers (Recommended for Feature Work)

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

Skills:
- `brainstorming` — Socratic design session
- `writing-plans` — Atomic task decomposition
- `subagent-driven-development` — One task per fresh subagent
- `test-driven-development` — Strict RGR enforcement

### BMAD (Recommended for Large Projects)

```
npx bmad-method install
```

Phases: Analysis → Planning → Solutioning → Implementation

Includes adversarial review — reviewers must find issues.
