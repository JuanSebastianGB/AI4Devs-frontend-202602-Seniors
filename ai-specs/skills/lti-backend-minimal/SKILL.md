---
name: lti-backend-minimal
description: >
  Minimal backend operations for LTI: Prisma + DATABASE_URL, Docker Postgres, CORS/PORT env,
  migrations, smoke API. Use when a frontend ticket needs DB/API alignment, not new domain features.
---

# LTI backend (minimal)

## Environment

- **Three scopes in practice:** (1) **Repo root** `.env` — variables for **`docker compose`** (`DB_*`). (2) **`backend/.env`** — `DATABASE_URL`, `PORT`, `CORS_ORIGINS` for the API (`dotenv` loads this when you run `pnpm run dev` from `backend/`). (3) **`frontend/.env`** — `REACT_APP_*` for CRA. They are not merged automatically; keep them consistent manually.
- Copy repo **`.env.example`** into `backend/.env` (and `frontend/.env` for `REACT_APP_*`). Adjust `DATABASE_URL` to match Docker (`DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`).
- **Critical:** standard **dotenv does not expand** shell-style placeholders inside values. A line like `DATABASE_URL="postgresql://${DB_USER}:...@localhost:5432/..."` is passed **literally** to Prisma and breaks auth or connectivity. Use a **single full URL** in `DATABASE_URL` (see `.env.example` comment).
- Prisma schema uses `env("DATABASE_URL")` — no secrets in `schema.prisma`.

## Common commands (from `backend/`)

| Command | Purpose |
|---------|---------|
| `pnpm run prisma:generate` | Generate client |
| `pnpm run prisma:migrate:dev` | Create/apply dev migrations |
| `pnpm run prisma:migrate` | Apply migrations (deploy style) |
| `pnpm exec prisma db seed` | Load `prisma/seed.ts` (after `migrate`; requires valid `DATABASE_URL`). **Not idempotent** in the stock seed — reruns can fail on unique constraints; use a fresh DB or adjust seed for local iteration. |
| `pnpm run dev` | API on `PORT` (default 3010) |
| `pnpm test` | Jest |

## Docker

From repo root: `docker compose up -d` — Postgres only. API runs on the host via `pnpm run dev` in `backend/`.

## Smoke check (API + DB)

After DB is up, migrations applied, and (if needed) seed run:

- `curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3010/` → expect **200**
- `curl -sS http://localhost:3010/position/1/interviewflow` → expect **200** and JSON with `interviewFlow` (requires seed data for meaningful steps)

If you change `backend/.env`, **restart** `pnpm run dev` so Prisma picks up the new `DATABASE_URL`.

## CORS / PORT

- `CORS_ORIGINS` — comma-separated list for CRA/Playwright.
- `PORT` — API port (default `3010`).

## TDD

When changing application or route code, follow the **tdd-v2** project skill for red–green–refactor.
