# NOV-7 — [Story] Load interview flow & candidates — errors & retry

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-7
- **title:** [Story] Load interview flow & candidates — errors & retry
- **url:** https://linear.app/nova-code/issue/NOV-7/story-load-interview-flow-and-candidates-errors-and-retry
- **status:** Done
- **statusType:** completed
- **priority:** Medium (value 3)
- **estimate:** 3 Points (value 3)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **project:** AI4Devs
- **projectId:** 75fb06f3-7dd7-4535-8be9-20686dc9b527
- **parentId:** NOV-5
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-7-story-load-interview-flow-candidates-errors-retry
- **createdAt:** 2026-05-11T00:47:20.038Z
- **updatedAt:** 2026-05-11T00:55:47.659Z
- **completedAt:** 2026-05-11T00:55:47.621Z
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** NOV-8 — [Story] Kanban UI — columns, cards, Unknown lane, mobile
- **blockedBy:** NOV-6 — [Story] Route & navigation — position detail shell
- **relatedTo:** (none)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Fetch `GET /position/:id/interviewflow` and `GET /position/:id/candidates` using `getApiBaseUrl()` from `frontend/src/apiConfig.js`. Implement **split failure** behavior from `CONTEXT.md`.

## Acceptance criteria

* **Interview flow fails** → full-page error + retry; **no** column skeleton pretending structure exists
* **Flow OK, candidates fail** → show columns (empty) + candidates error + **retry candidates only**
* Success: have ordered steps (`orderIndex` asc, `id` asc tie-break) and candidate list with `fullName`, `currentInterviewStep` (name), `averageScore`, `id`, `applicationId`

## Scope

* New service module(s) under `frontend/src/services/` or `frontend/src/api/`
* Note: backend path is `/position` (singular) for these GETs

## Unit (RTL) — TDD

* RED: mock fetch — flow error shows full error UI; candidates-only error shows column chrome + error strip
* GREEN: hook or loader logic

## Env

* `REACT_APP_API_URL` only; no hardcoded `localhost:3010`

---

## Comments

None at export time (`list_comments` returned empty).
