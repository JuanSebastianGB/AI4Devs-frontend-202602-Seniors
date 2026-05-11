---
name: lti-frontend-tickets
description: >
  Orchestrate frontend-first LTI work: env/API/CORS, graphify/Linear optional, TDD-first units
  (Jest+RTL per tdd-v2) then implementation, then Playwright E2E when in scope; minimal backend.
  Use when starting or splitting a frontend ticket in this repo.
---

# LTI frontend tickets (orchestrator)

## Default order

1. **Contract** — `REACT_APP_API_URL`, backend `CORS_ORIGINS`, `DATABASE_URL` / Docker (see `.env.example`). Fix env before UI if the ticket is blocked by API/CORS. For any ticket that **calls the API from the browser**, validate the contract on the host before “done”: **`curl`** to the relevant routes (see `lti-backend-minimal` smoke) or a **Playwright** spec with `webServer` + DB up. Mocked unit tests alone do not prove the stack works end-to-end.
2. **Graphify** (if cross-module or unfamiliar) — `read graphify-out/GRAPH_REPORT.md` or `graphify query` per `AGENTS.md`.
3. **Linear** (optional) — use `linear-lti-issues` to create/update the ticket with paths and test plan (include test-first unit scenarios).
4. **RED — unit tests first** — Jest + RTL: add failing tests that describe the new behavior (`frontend/`, `pnpm test` / watch). **MUST** follow **tdd-v2** (`.cursor/skills/tdd-v2/SKILL.md`) for frontend unit/component work.
5. **GREEN — implement** — smallest change in `frontend/` that makes the new tests pass (Bootstrap, Router, existing patterns). **Apply `lti-frontend-practices`** (`.cursor/skills/lti-frontend-practices/SKILL.md`) for hooks, effects, composition, and `frontend/src` file placement before or while coding.
6. **REFACTOR** — clean up while **CI=true pnpm test** stays green.
7. **E2E** (if in scope) — Playwright (`pnpm run test:e2e`) with DB + API up when `webServer` starts the backend.
8. **Graphify update** — after substantive code edits: `graphify update .`

## Backend touch rule

Touch `backend/` only for: migrations/env alignment, CORS/port, contract bugs, or tests required to unblock the frontend ticket. Use `lti-backend-minimal` + `tdd-v2` when changing server code.

## Verification gates

From `frontend/`: `pnpm run typecheck`, **`CI=true pnpm test`** (mandatory non-interactive unit gate; no new failures), and `pnpm run test:e2e` when E2E is in scope. Zero TypeScript and linter errors on touched files per `AGENTS.md`.
