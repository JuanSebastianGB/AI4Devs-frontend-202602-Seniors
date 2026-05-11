---
name: lti-frontend-practices
description: >
  CRA + React 18 patterns (react.dev-aligned hooks/effects), repo layout, Router, Bootstrap, RTL, Playwright;
  defer API details to Context7. Use when choosing patterns for new frontend code or tests.
---

# LTI frontend practices

## Before coding with a library

Per `AGENTS.md`, use **Context7** (`ctx7`) for current docs when touching: React, React Router, Testing Library, Playwright, Bootstrap, etc.

Guidance below matches **React 18** and official **react.dev** themes (Rules of Hooks, effects as external sync, honest dependency arrays). For API edge cases, always confirm with Context7.

## Project structure (this repo)

- **`frontend/src/components/`** — UI components (presentational and forms).
- **`frontend/src/services/`** — API calls and integration with `getApiBaseUrl()` / fetch patterns.
- **`frontend/src/apiConfig.js`** — base URL resolution; tests colocated as `apiConfig.test.js` (or adjacent `*.test.tsx`).
- **App entry:** `App.js` / `App.tsx` — keep routing as the single canonical app shell unless a ticket refactors it deliberately.
- **`.js` vs `.tsx`:** match surrounding files when editing; prefer **new** code in `.ts`/`.tsx` per path rules. Do not rename files for style alone.

## Rules of Hooks

- Call Hooks only at the **top level** of a function component or a **custom Hook** — never inside conditions, loops, or nested plain functions.
- Call Hooks **before** any early `return` in the component.
- If logic must be conditional, **split into child components** or move conditions *after* Hook calls, not around them.

## Custom hooks

- Prefix with **`use`** only when the function **calls React Hooks** internally. Pure helpers (sort, format, map data) should **not** use the `use` prefix — avoids implying Hook rules where they do not apply.

## Effects (`useEffect`)

- Use **`useEffect`** to synchronize with an **external system** (subscriptions, timers, browser APIs, imperative third-party widgets), not to derive values you could compute **during render**.
- Provide a **complete dependency array**; align with `react-hooks/exhaustive-deps` when the linter is enabled. Split unrelated side effects into **separate** `useEffect` blocks so each has a clear purpose and dependency list.
- Return **cleanup** when subscribing or connecting (disconnect, clear timer, abort) so unmount and dependency changes do not leak.
- Avoid **infinite loops**: do not call `setState` unconditionally inside an effect without a stable dependency strategy; do not omit the dependency array if the effect reads props/state.

## Composition

- Prefer **small components** with clear props; **lift state** only as high as needed for shared UI.
- Keep handlers readable; extract subcomponents when JSX or effect logic grows, without speculative abstractions.

## Conventions (this repo)

- **TDD (behavior changes):** follow **`tdd-v2`** — failing **Jest + RTL** test before production code; keep **`CI=true pnpm test`** green before refactor.
- **Routing:** `react-router-dom` v6 — keep routes in `App.js` (or the single canonical App entry) unless refactoring deliberately.
- **API:** `getApiBaseUrl()` from `src/apiConfig.js`; configure `REACT_APP_API_URL` per environment.
- **Components:** prefer readable handlers and colocated `*.test.js` / `*.test.tsx` next to source or under `src/**/__tests__/` per CRA.
- **RTL:** prefer `screen.getByRole`, `await userEvent.setup()` + async interactions; avoid implementation-detail selectors (fragile CSS / internal DOM).
- **Playwright:** prefer `getByRole`, `getByLabel`, or stable `data-testid` agreed in the ticket; align with CORS (see `lti-qa-frontend`).
- **a11y:** preserve semantic headings and labels for recruiter flows (dashboard, add candidate, positions).

## Anti-patterns

- Hardcoding API hosts in new code.
- `eject` without team decision.
- Skipping **`tdd-v2`** for behavioral frontend changes (implementing before a failing unit test).
- Skipping `typecheck` / **`CI=true pnpm test`** on touched frontend files when the ticket requires quality gates.
- Hooks inside conditions/loops, or **`use`**-prefixed “hooks” that do not call Hooks.
- One giant `useEffect` mixing unrelated concerns, missing cleanup for subscriptions, or deriving render-only data in effects instead of in render.
