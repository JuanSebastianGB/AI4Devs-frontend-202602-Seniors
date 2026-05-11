# NOV-5 — [Epic] Position kanban — hiring stages board

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-5
- **title:** [Epic] Position kanban — hiring stages board
- **url:** https://linear.app/nova-code/issue/NOV-5/epic-position-kanban-hiring-stages-board
- **status:** Done
- **statusType:** completed
- **priority:** High (value 2)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **project:** AI4Devs
- **projectId:** 75fb06f3-7dd7-4535-8be9-20686dc9b527
- **parentId:** (none)
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-5-epic-position-kanban-hiring-stages-board
- **createdAt:** 2026-05-11T00:47:13.944Z
- **updatedAt:** 2026-05-11T00:55:57.227Z
- **completedAt:** 2026-05-11T00:55:57.201Z
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** (none)
- **blockedBy:** (none)
- **relatedTo:** (none)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Scrum

**Epic** for the position detail view: kanban of candidates by interview stage. Domain decisions from grilling are captured in repo `CONTEXT.md` (root).

## Goal

Recruiters open a position from the list, see candidates as cards in columns matching the interview flow, drag cards to change stage, with resilient loading and API-aligned behavior.

## Scope (repo)

* `frontend/src/` — route `/positions/:positionId`, page content, services, RTL tests
* `CONTEXT.md` — canonical glossary & decisions (do not paste secrets)

## API (contract)

* `GET /position/:id/interviewflow` — columns (`interviewSteps`: `id`, `name`, `orderIndex`)
* `GET /position/:id/candidates` — cards (`fullName`, `currentInterviewStep` **name string**, `averageScore`, plus `id` candidate, `applicationId` per backend)
* `PUT /candidates/:id` — body `{ applicationId, currentInterviewStep }` integers; path `:id` = **candidate** id; **not** `.../stage`

## Env

* `REACT_APP_API_URL` (see `.env.example`)

## Child stories

Create sub-issues under this epic for: routing & navigation; data fetch & errors; board UI; drag & persist; tests.

## Definition of Done (epic)

* All child stories done
* `pnpm run typecheck` and `CI=true pnpm test` green from `frontend/`
* Matches `CONTEXT.md` decisions (Unknown lane, rollback, refetch candidates, etc.)

---

## Comments

None at export time (`list_comments` returned empty).
