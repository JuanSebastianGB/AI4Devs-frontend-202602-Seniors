# NOV-8 — [Story] Kanban UI — columns, cards, Unknown lane, mobile

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-8
- **title:** [Story] Kanban UI — columns, cards, Unknown lane, mobile
- **url:** https://linear.app/nova-code/issue/NOV-8/story-kanban-ui-columns-cards-unknown-lane-mobile
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
- **gitBranchName:** jsebastiangb12/nov-8-story-kanban-ui-columns-cards-unknown-lane-mobile
- **createdAt:** 2026-05-11T00:47:21.830Z
- **updatedAt:** 2026-05-11T00:55:48.406Z
- **completedAt:** 2026-05-11T00:55:48.359Z
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** NOV-9 — [Story] Drag-and-drop — optimistic move, PUT, rollback, refetch
- **blockedBy:** NOV-7 — [Story] Load interview flow & candidates — errors & retry
- **relatedTo:** (none)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Render one column per `interviewStep` (sorted per `CONTEXT.md`). Each **candidate card** shows **full name** and **average score** formatted with **exactly one decimal** (e.g. `4.0`, `3.7`).

## Unknown lane

* If `currentInterviewStep` **name** does not match any column → card in **Unknown** lane with visible warning
* Lane **after** all real stages (right desktop, **bottom** when stacked)
* **Not** a **drop target**; cards may be **dragged out** to a real column (story 4)

## Responsive

* Desktop: horizontal columns
* Mobile: stages **stacked**, full width

## Acceptance criteria

* Column headers = step names; order matches `orderIndex` then `id`
* Empty columns still visible
* Unknown lane only when needed

## Unit (RTL) — TDD

* RED: given fixture flow + candidates, cards land in correct columns; unmatched → Unknown; score format `toHaveText` one decimal
* GREEN: presentational + mapping helpers (pure functions testable)

---

## Comments

None at export time (`list_comments` returned empty).
