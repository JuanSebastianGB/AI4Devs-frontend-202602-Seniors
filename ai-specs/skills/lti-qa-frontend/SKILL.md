---
name: lti-qa-frontend
description: >
  Frontend QA: mandatory TDD for units (tdd-v2 + Jest+RTL), test colocation, CI unit gate;
  Playwright webServer, CORS/baseURL. Use when writing or running frontend tests and E2E.
---

# LTI frontend QA

## TDD (mandatory for units)

- **Normative loop:** follow **`tdd-v2`** (`.cursor/skills/tdd-v2/SKILL.md`): **RED** (failing RTL test) → **GREEN** (minimal code) → **REFACTOR** (keep **`CI=true pnpm test`** green).
- **Stack:** **Jest** + **React Testing Library** + **`@testing-library/user-event`** + **`@testing-library/jest-dom`** via **`react-scripts test`** (CRA default).
- **Colocation:** place tests as `*.test.js`, `*.test.jsx`, `*.test.ts`, or `*.test.tsx` next to source files, or under `src/**/__tests__/**`, matching CRA `testMatch`.
- **E2E is not a substitute** for unit TDD — Playwright covers cross-page / real-browser flows; behavior still needs RTL-driven unit tests first unless the ticket is explicitly E2E-only.

## Commands (from `frontend/`)

| Command | Purpose |
|---------|---------|
| `CI=true pnpm test` | Jest + RTL via `react-scripts test` (**non-interactive** gate; use in CI and before “done”). **Do not** pass `pnpm test -- --watchAll=false` through CRA — it can confuse Jest’s argv; rely on `CI=true` instead. |
| `pnpm run test:watch` | Interactive watch mode (local TDD) |
| `pnpm run typecheck` | `tsc --noEmit` |
| `pnpm run test:e2e` | Playwright CLI |
| `pnpm run test:e2e:ui` | Playwright UI mode |

First-time Playwright browsers: `pnpm exec playwright install` (or `pnpm exec playwright install chromium`).

## CORS and `baseURL`

- Backend allows origins from `CORS_ORIGINS` (default includes `http://localhost:3000` and `http://127.0.0.1:3000`).
- Playwright `use.baseURL` is **`http://localhost:3000`**. Open the app under an allowed origin or extend `CORS_ORIGINS` / backend list.

## `playwright.config.ts`

- Uses **`webServer` array**: backend `pnpm run dev` (cwd `../backend`) then CRA `pnpm run start` with `BROWSER=none`.
- Requires **`DATABASE_URL`** (and a running Postgres) for the backend server to become ready at `http://localhost:3010/`.
- Local: start DB (`docker compose up -d` from repo root), ensure **`DATABASE_URL` is a full URL** (see `lti-backend-minimal`), run **`pnpm exec prisma migrate deploy`** (or `prisma:migrate:dev`) and **`pnpm exec prisma db seed`** in `backend/` when tests need data, then `pnpm run test:e2e` from `frontend/`. With servers already up, `reuseExistingServer` skips restart outside CI.

### CI vs local server reuse

- **`reuseExistingServer`** is `true` when **either** `CI` is unset **or** `PLAYWRIGHT_REUSE_EXISTING=1` is set. Otherwise (`CI=true` without the override) Playwright starts fresh servers and **fails** if ports `3000` / `3010` are already taken.
- **CI / Actions** (recommended): `CI=true pnpm run test:e2e` with both ports free — matches `.github/workflows/ci.yml`.
- **Local with servers already running**: `pnpm run test:e2e` (no `CI`). Playwright reuses your `pnpm start` + backend.
- **Local but you need `CI=true`** (e.g. to force `forbidOnly` / retries / `github` reporter): `PLAYWRIGHT_REUSE_EXISTING=1 CI=true pnpm run test:e2e`.

## When RTL vs Playwright

- **RTL** — component logic, forms validation messages, isolated UI states.
- **Playwright** — real navigation, multi-page flows, integration with API and static assets.
