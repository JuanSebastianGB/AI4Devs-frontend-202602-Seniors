# MANDATORY

- As package manager only use pnpm
- You have to use context7 MCP server or EXA MCP server before start working with an external library
- ZERO typescript or linter errors allowed

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

# Mandatory

For any information required externally, use the context7 MCP server as much as possible.

# Language

English

## Cursor harness: frontend-first + Linear

- **Primary work:** frontend tickets in `frontend/` (CRA, React, TypeScript, Bootstrap, React Router). Prefer new code in `.ts`/`.tsx` where practical.
- **Skills (storage vs discovery):** On disk, skill content lives under **`ai-specs/skills/`**. The path **`.cursor/skills/`** is a **symlink** to that tree so Cursor can discover skills. Edits under either path are the same files. The script **`./scripts/sync-ai-specs-skills.sh`** is only needed if your checkout uses a **copy-based** layout (two independent trees); if `.cursor/skills` resolves to `ai-specs/skills`, the script is a no-op by design. Same idea for **`.cursor/commands`** → **`ai-specs/commands`**.
- **Path rules:** `.cursor/rules/` — `frontend-cra-react.mdc` applies under `frontend/**`; `backend-minimal.mdc` under `backend/**`.
- **Orchestration skills:** `lti-frontend-tickets` (default workflow), `lti-qa-frontend` (tests/E2E), `lti-frontend-practices` (React 18 + react.dev-aligned hooks, effects, composition, and `frontend/src` layout), `tdd-v2` (**mandatory** red–green–refactor for frontend units and backend when code changes), `lti-backend-minimal` (DB/API env), `linear-lti-issues` (Linear MCP).
- **Linear:** use the Linear integration for issues; **never** paste credentials, full `.env` files, or private database URLs into issue descriptions.
- **Mandatory: frontend TDD (units)** — For changes under `frontend/` that **add or change behavior**, **unit/component tests are required** and must follow **TDD**: write a **failing** test first (RED), minimal implementation (GREEN), then refactor (REFACTOR), per the **`tdd-v2`** skill (`.cursor/skills/tdd-v2/SKILL.md`). **Stack:** **Jest + React Testing Library + `@testing-library/user-event` + `@testing-library/jest-dom`** via `react-scripts test` (`pnpm test` / `CI=true pnpm test`). **Playwright** is for **E2E** when the ticket requires it (run after unit suite is green unless the ticket is E2E-only). **Exceptions** (rare): pure cosmetic/config with no testable behavior, or team-agreed skip — **document in the Linear issue or PR**.
- **Quality gates (frontend):** from `frontend/` run `pnpm run typecheck`, **`CI=true pnpm test`** (non-interactive unit gate), and `pnpm run test:e2e` when the task includes E2E. E2E needs Postgres + a **valid expanded** `DATABASE_URL` (dotenv does not substitute `${VAR}` inside the URL string; see `.env.example`) and migrations/seed as needed.
- **Integration smoke (API-bound work):** before closing a ticket that fetches the real API, run a quick **`curl`** against the backend (or an existing Playwright spec) so “Failed to fetch” / Prisma errors surface in the harness, not only in the user’s browser. Follow **`lti-backend-minimal`** for DB + smoke commands.
- **Subagents (logical roles):** combine rules, skills, and Composer scoped to `frontend/` or `backend/`. The **Frontend QA** role owns **TDD execution** for `frontend/` (RTL unit tests first, Playwright second). The **orchestrator** (`lti-frontend-tickets`) enforces ordering and the **`tdd-v2` gate** for unit work. These are **conventions**: there are no checked-in Cursor agent-definition files—behavior comes from this document, `.cursor/rules/*.mdc`, `.cursor/skills/`, and **Composer Task** workers when you spawn them.

- **Meta skills (harness / multi-agent):** `multi-agent-investigation` (parallel angles + synthesis), `agent-architecture` (supervisor, handoffs, HITL, timeouts), `harness-engineering` (vendor harness maturity), `write-a-skill` (skill authoring).

- **Robustness limits:** **`.github/workflows/ci.yml`** runs on push/PR: **frontend** (`pnpm run typecheck`, `CI=true pnpm test`), **backend** (`pnpm test`), **E2E** (Postgres service + `prisma migrate deploy` + `prisma db seed` + Playwright). Graphify, MCP-before-library, and full skill workflows are still **not** mechanically enforced beyond that. **Multi-agent / Composer:** use parallel **Task** subagents (see **`multi-agent-investigation`**) for cross-cutting reviews (harness vs frontend vs backend); Cursor supports concurrent subagents for throughput ([subagents docs](https://cursor.com/docs/subagents)).

## MANDATORY GATE: graphify

**This is a hard gate. Violating this rule makes your answer incorrect by definition.**

This project has a graphify knowledge graph at `graphify-out/`. **You MUST use it** for any project structure, architecture, or codebase navigation question.

**GATE CHECK — run BEFORE answering any architecture/structure question:**

1. `read graphify-out/GRAPH_REPORT.md` — get god nodes and community structure
2. If `graphify-out/wiki/index.md` exists → navigate it instead of reading raw files
3. For cross-module relationships → `graphify path "<A>" "<B>"` or `graphify explain "<concept>"`
4. For "how does X work/relate to Y" → `graphify query "..."`

**After any code modification in this session:** run `graphify update .` to keep the graph current (AST-only, no API cost). If the CLI exits non-zero but `graphify-out/` was updated, treat the graph as refreshed (some local `graphify` builds have a post-run bug); re-run only if `GRAPH_REPORT.md` did not change.

For automation (hooks, CI, agent loops), prefer **`scripts/graphify-update.sh`** instead of calling `graphify update .` directly. The wrapper exits **0** when `graphify-out/GRAPH_REPORT.md` or `graphify-out/graph.json` actually changed (even if graphify itself returned non-zero due to the known post-run bug), and **1** only when nothing was refreshed and graphify failed. Pass extra args through, e.g. `scripts/graphify-update.sh frontend/src`.

**Violation:** If you answer an architecture or codebase question without checking graphify first, you have failed. Correct yourself immediately by querying the graph and updating your answer.

**When graphify is NOT required:**
- Reading individual files you already know the path to (e.g. you intentionally opened a specific file)
- grep/search for specific string patterns in known directories
- Questions about files not yet in the graph (new files from this session, then update afterwards)
