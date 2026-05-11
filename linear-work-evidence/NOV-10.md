# NOV-10 — [Story] QA gate — typecheck, CI unit suite, optional Playwright

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-10
- **title:** [Story] QA gate — typecheck, CI unit suite, optional Playwright
- **url:** https://linear.app/nova-code/issue/NOV-10/story-qa-gate-typecheck-ci-unit-suite-optional-playwright
- **status:** Done
- **statusType:** completed
- **priority:** Low (value 4)
- **estimate:** 2 Points (value 2)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **project:** AI4Devs
- **projectId:** 75fb06f3-7dd7-4535-8be9-20686dc9b527
- **parentId:** NOV-5
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-10-story-qa-gate-typecheck-ci-unit-suite-optional-playwright
- **createdAt:** 2026-05-11T00:47:24.600Z
- **updatedAt:** 2026-05-11T00:55:48.899Z
- **completedAt:** 2026-05-11T00:55:48.877Z
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** (none)
- **blockedBy:** NOV-9 — [Story] Drag-and-drop — optimistic move, PUT, rollback, refetch
- **relatedTo:** (none)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Close the epic with **zero TS/lint regressions** and **mandatory** unit coverage per `AGENTS.md` / `tdd-v2`.

## Commands (from `frontend/`)

* `pnpm run typecheck`
* `CI=true pnpm test`

## E2E (Playwright) — optional unless PO asks

* `pnpm run test:e2e` requires Postgres + `DATABASE_URL` per `.env.example`
* Scenario: positions → position detail → drag if stable in CI

## Acceptance criteria

* All above pass on PR
* New behavior covered by RTL tests from prior stories (not cosmetic-only skips)

## Blocks

* Run after Stories 1–4 are functionally complete (or in parallel for typecheck fixes)

---

## Comments

None at export time (`list_comments` returned empty).
