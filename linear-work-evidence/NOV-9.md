# NOV-9 — [Story] Drag-and-drop — optimistic move, PUT, rollback, refetch

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-9
- **title:** [Story] Drag-and-drop — optimistic move, PUT, rollback, refetch
- **url:** https://linear.app/nova-code/issue/NOV-9/story-drag-and-drop-optimistic-move-put-rollback-refetch
- **status:** Done
- **statusType:** completed
- **priority:** Medium (value 3)
- **estimate:** 5 Points (value 5)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **project:** AI4Devs
- **projectId:** 75fb06f3-7dd7-4535-8be9-20686dc9b527
- **parentId:** NOV-5
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-9-story-drag-and-drop-optimistic-move-put-rollback-refetch
- **createdAt:** 2026-05-11T00:47:23.484Z
- **updatedAt:** 2026-05-11T00:55:48.577Z
- **completedAt:** 2026-05-11T00:55:48.556Z
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** NOV-10 — [Story] QA gate — typecheck, CI unit suite, optional Playwright
- **blockedBy:** NOV-8 — [Story] Kanban UI — columns, cards, Unknown lane, mobile
- **relatedTo:** (none)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Dragging a card to another column updates the server stage and keeps UI honest.

## Behavior (`CONTEXT.md`)

* **Optimistic**: card moves on drop immediately
* `PUT /candidates/:candidateId` with body `{ applicationId, currentInterviewStep }` where `currentInterviewStep` = **numeric** `interviewStep.id` of target column
* **Failure** → **rollback** card + concise error (inline or toast)
* **Success** → **refetch** `GET /position/:id/candidates` only (not interview flow)
* **Unknown** column: not a drop target (reject or snap back)

## Library

* Prefer Context7 docs for chosen DnD lib (e.g. `@dnd-kit`) before implementation; align with CRA + React 18 (`lti-frontend-practices`)

## Acceptance criteria

* Drag between real columns persists after refetch
* Failed network shows previous column + user-visible error
* No PUT when dropping on Unknown

## Unit (RTL) — TDD

* RED: handler calls API with correct ids; rollback path on rejected promise (mock `fetch`)
* Note: full drag UX may need integration/E2E; unit-test the **stage-change** orchestration

---

## Comments

None at export time (`list_comments` returned empty).
