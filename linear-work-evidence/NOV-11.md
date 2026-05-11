# NOV-11 — [Frontend] Vertical slice: CV upload lives in candidateApi (FileUploader)

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-11
- **title:** [Frontend] Vertical slice: CV upload lives in candidateApi (FileUploader)
- **url:** https://linear.app/nova-code/issue/NOV-11/frontend-vertical-slice-cv-upload-lives-in-candidateapi-fileuploader
- **status:** Backlog
- **statusType:** backlog
- **priority:** Medium (value 3)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-11-frontend-vertical-slice-cv-upload-lives-in-candidateapi
- **createdAt:** 2026-05-11T02:09:45.975Z
- **updatedAt:** 2026-05-11T02:13:44.370Z
- **completedAt:** null
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:** (none)
- **blockedBy:** (none)
- **relatedTo:**
  - NOV-12 — [Frontend] Vertical slice: candidate creation via candidateApi (AddCandidateForm)
  - NOV-13 — [Frontend] Vertical slice: remove duplicate axios candidateService + dependency cleanup
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Make **CV upload** (`POST /upload`) go through a single TypeScript service module (`candidateApi`) so `FileUploader` no longer owns raw `fetch` + URL assembly. This is the first tracer bullet toward removing the duplicate **axios** implementation in `candidateService.js`.

## Scope

* Add `frontend/src/services/candidateApi.ts` with `uploadCvFile(file: File)` and a **private** `fetchOrExplainNetwork`-style helper (same behavior class as `frontend/src/services/positionBoardApi.ts`: `TypeError` → message mentioning `getApiBaseUrl()`, backend, `REACT_APP_API_URL`).
* Migrate `frontend/src/components/FileUploader.js` to call `uploadCvFile` only (no `getApiBaseUrl` / `fetch` in the component for upload).
* **Surface upload failures in UI:** extend `FileUploader` with a parent callback (e.g. `onUploadError`) so `AddCandidateForm` can show the same `Alert` pattern as submit errors. **Avoid** user-facing failures that only go to `console.error`.
* **Error lifecycle:** per `CONTEXT.md`, clear shared form `error` at the **start** of a new upload attempt, when **changing the selected file**, on **successful upload** (clear **all** form error state, including stale submit errors), and keep **dismiss** on `Alert` as an extra path.
* **Out of scope for this ticket:** `POST /candidates`, deleting `candidateService.js`, shared `apiFetch.ts` extraction (optional follow-up).

## Env

* `REACT_APP_API_URL` / `getApiBaseUrl()` — do not document secrets.

## Acceptance criteria

* Uploading a file still yields the same **response shape** the form expects today (`filePath`, `fileType` per current JSON contract).
* `multipart/form-data`: do **not** set `Content-Type` manually on `FormData` requests (browser sets boundary).
* On **network failure** (`fetch` throws `TypeError`), the user-visible message class is **consistent** with board API copy where applicable.
* `FileUploader` contains **no** direct `fetch(${getApiBaseUrl()}/upload)`.
* **Upload failure UX:** when upload fails (`!res.ok`, network, parse), the user sees a **clear error** in the add-candidate form (same alert area as submit), not only console output.
* **Stale errors:** after a failed upload, starting a **new** upload (new file selection or upload click) clears the previous alert state; after **successful** upload, parent clears `error` so a prior submit failure message does not linger.

## Unit (RTL) / Jest — test-first

* Add `frontend/src/services/candidateApi.test.ts` (TDD: RED → GREEN → REFACTOR).
* **RED scenarios (write first):**
  * Successful upload: `fetch` called with `POST`, body is `FormData` containing the file field the backend expects.
  * `!res.ok`: rejects with useful message.
  * `fetch` rejects with `TypeError`: error mentions API base / connectivity (align with `positionBoardApi.test.ts` pattern).
* **GREEN:** implement `uploadCvFile` until tests pass.
* Optional: **RTL** on `FileUploader` / parent wiring if needed to lock `onUploadError`, error reset on retry, and **clear error on successful upload** (keep minimal).

## E2E (Playwright)

* If an existing spec covers CV upload, keep it green (`baseURL` `http://localhost:3000`). No new E2E required unless regressions appear.

## Graphify / navigation

* Related hub: Community around `getApiBaseUrl`, `positionBoardApi`, legacy `candidateService` — `graphify query "getApiBaseUrl candidateService upload"`.

## Definition of done

* `pnpm run typecheck` and `CI=true pnpm test` pass from `frontend/`.
* This ticket **does not** remove `candidateService.js` yet.

## Domain note

* **CV upload failure (UI)** and **shared** `error` lifecycle (including **clear on upload success**) are recorded in repository root `CONTEXT.md`.

---

## Comments

None at export time (`list_comments` returned empty).
