---
name: linear-lti-issues
description: >
  Create and enrich Linear issues for LTI with frontend-first context: file paths, env, Playwright/RTL
  criteria, graphify anchors. Use when the user asks for Linear tickets, backlog items, or issue
  enrichment with codebase context. Requires the Linear plugin / MCP in Cursor.
---

# Linear LTI issues

## When to use

- Creating a **new** Linear issue for a frontend (or full-stack) LTI task.
- **Enriching** an existing issue with implementation notes, test plan, and file references.
- Linking work to **graphify** (`graphify-out/GRAPH_REPORT.md` or `graphify query`) when the change is architectural.

## When not to use

- Implementing code (use `lti-frontend-tickets` + normal agent flow).
- Non-Linear trackers.

## Workflow

1. **Team context** — call `list_teams` (Linear MCP); pick the correct `team` for `save_issue`.
2. **Create** — `save_issue` with `title`, `team`, and Markdown `description` (use **real newlines**, not `\\n` escape sequences per Linear plugin rules).
3. **Enrich / update** — `get_issue` by id or identifier; then `save_issue` with `id` set to append sections.

## Description template (frontend-first)

Use these sections in Markdown:

- **Goal** — one paragraph.
- **Scope** — UI routes (`frontend/src/...`), API touchpoints if any (`backend/src/...`).
- **Env** — `REACT_APP_API_URL`, `DATABASE_URL` / Docker; never paste secrets.
- **Acceptance criteria** — bullet list (user-visible + technical).
- **Unit (RTL)** — which components/services to cover; list **test-first scenarios** (expected failing assertions / behaviors **before** the feature exists) so implementers can run RED → GREEN → REFACTOR.
- **E2E (Playwright)** — scenario name, `baseURL` note (`http://localhost:3000` vs CORS).
- **Graphify** (optional) — god nodes or `graphify query` snippet if cross-cutting.

## MCP quick reference

- `save_issue` — create (no `id`) or update (with `id`). Required on create: `title`, `team`.
- `get_issue` — read current description and state.
- `list_teams` — resolve team name/id.

## Constraints

- **Never** put credentials, private URLs with passwords, or full `.env` contents in Linear.
- Prefer **English** in issue titles and bodies unless the team policy says otherwise.
