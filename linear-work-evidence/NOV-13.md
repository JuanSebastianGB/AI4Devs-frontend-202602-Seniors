# NOV-13 — [Frontend] Vertical slice: remove duplicate axios candidateService + dependency cleanup

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-13
- **title:** [Frontend] Vertical slice: remove duplicate axios candidateService + dependency cleanup
- **url:** https://linear.app/nova-code/issue/NOV-13/frontend-vertical-slice-remove-duplicate-axios-candidateservice
- **status:** Backlog
- **statusType:** backlog
- **priority:** Medium (value 3)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-13-frontend-vertical-slice-remove-duplicate-axios
- **createdAt:** 2026-05-11T02:09:56.281Z
- **updatedAt:** 2026-05-11T02:15:25.148Z
- **completedAt:** null
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** (none)
- **blockedBy:**
  - NOV-12 — [Frontend] Vertical slice: candidate creation via candidateApi (AddCandidateForm)
- **relatedTo:**
  - NOV-11 — [Frontend] Vertical slice: CV upload lives in candidateApi (FileUploader)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Eliminate the **second implementation** of candidate HTTP calls: `frontend/src/services/candidateService.js` (**axios** `uploadCV` / `sendCandidateData`) is unused by components after NOV-11/NOV-12 and must not remain as a drift magnet.

## Scope

* `rg` / grep: confirm **no** remaining imports of `candidateService`, `uploadCV`, or `sendCandidateData` from `frontend/src`.
* Delete `frontend/src/services/candidateService.js`.
* If **axios** is not imported anywhere else under `frontend/`, remove it from `frontend/package.json` and run `pnpm install` so lockfile updates (use **pnpm** only).
* **Out of scope:** extracting shared `apiFetch.ts` from `positionBoardApi` + `candidateApi` (optional future ticket).

## Env

* N/A (no secrets).

## Acceptance criteria

* No dead file `candidateService.js` in the tree.
* `axios` dependency removed **iff** no remaining frontend usage.
* CI-local gates pass: `pnpm run typecheck`, `CI=true pnpm test` from `frontend/`.
* **Regression check:** add-candidate flow still matches **Decisions** in repository root `CONTEXT.md` (grill-closed rules: errors, language, shared `error` lifecycle — owned by NOV-11/12; this ticket is cleanup only).

## Unit (RTL) / Jest

* Remove or replace any tests that imported `candidateService` (if none, nothing to do).
* Full suite green after deletion.

## E2E (Playwright)

* Smoke add-candidate + board flows if time permits; not required if unit gate is exhaustive and manual smoke done in PR.

## Graphify

* After merge, run `graphify update .` so the graph drops stale `candidateService` / axios nodes.

## Definition of done

* Single source of truth for `POST /upload` and `POST /candidates` is `candidateApi.ts`.

## Dependency

* **Blocked by:** NOV-12 (both call sites must use `candidateApi` before deleting the legacy module).

## Domain note

* **Grill session closed:** product rules live in `CONTEXT.md`; open **orphan file** ambiguity documented there under **Flagged ambiguities**.

---

## Comments

None at export time (`list_comments` returned empty).
