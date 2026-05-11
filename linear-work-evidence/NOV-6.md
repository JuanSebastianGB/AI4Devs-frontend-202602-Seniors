# NOV-6 — [Story] Route & navigation — position detail shell

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-6
- **title:** [Story] Route & navigation — position detail shell
- **url:** https://linear.app/nova-code/issue/NOV-6/story-route-and-navigation-position-detail-shell
- **status:** Done
- **statusType:** completed
- **priority:** Medium (value 3)
- **estimate:** 2 Points (value 2)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **project:** AI4Devs
- **projectId:** 75fb06f3-7dd7-4535-8be9-20686dc9b527
- **parentId:** NOV-5
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-6-story-route-navigation-position-detail-shell
- **createdAt:** 2026-05-11T00:47:18.669Z
- **updatedAt:** 2026-05-11T00:55:47.482Z
- **completedAt:** 2026-05-11T00:55:47.458Z
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** NOV-7 — [Story] Load interview flow & candidates — errors & retry
- **blockedBy:** (none)
- **relatedTo:** (none)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Expose the position kanban at `/positions/:positionId` and wire **View process** from the existing positions list. Header shows **position title** (from flow API once loaded, or loading) and **back** always goes to `/positions` (`Link` / `navigate`, not history-only).

## Scope

* `frontend/src/App.js` — `Route` for `/positions/:positionId`
* `frontend/src/components/Positions` (or equivalent) — link/button with `positionId`
* New page component (e.g. `PositionKanban` or `PositionDetail`)

## Acceptance criteria

* Visiting `/positions/:positionId` renders the page shell (title area + back)
* Back navigates to `/positions` from deep link
* View process passes correct `positionId`

## Unit (RTL) — TDD

* RED: route renders shell; back control has `to="/positions"` or triggers navigate to `/positions`
* GREEN: minimal implementation

## E2E (optional this story)

* Navigate list → detail → back lands on list

## Graphify

* Related: `Position`, `InterviewFlow` hubs in `graphify-out/GRAPH_REPORT.md`

---

## Comments

None at export time (`list_comments` returned empty).
