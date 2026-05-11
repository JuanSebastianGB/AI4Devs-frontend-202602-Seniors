# NOV-12 — [Frontend] Vertical slice: candidate creation via candidateApi (AddCandidateForm)

Snapshot from Linear API (`get_issue`). Field names mirror API response.

---

## Metadata

- **identifier:** NOV-12
- **title:** [Frontend] Vertical slice: candidate creation via candidateApi (AddCandidateForm)
- **url:** https://linear.app/nova-code/issue/NOV-12/frontend-vertical-slice-candidate-creation-via-candidateapi
- **status:** Backlog
- **statusType:** backlog
- **priority:** Medium (value 3)
- **team:** Nova-code
- **teamId:** d10abae0-8937-4197-a862-ee01d77b3e6f
- **labels:** (none)
- **createdBy:** juan sebastian Gonzalez
- **createdById:** 4fb602c9-8351-49c5-a523-406f02412735
- **gitBranchName:** jsebastiangb12/nov-12-frontend-vertical-slice-candidate-creation-via-candidateapi
- **createdAt:** 2026-05-11T02:09:51.737Z
- **updatedAt:** 2026-05-11T02:12:34.410Z
- **completedAt:** null
- **startedAt:** null
- **canceledAt:** null
- **archivedAt:** null
- **dueDate:** null

## Relations

- **blocks:**
  - NOV-13 — [Frontend] Vertical slice: remove duplicate axios candidateService + dependency cleanup
- **blockedBy:** (none)
- **relatedTo:**
  - NOV-11 — [Frontend] Vertical slice: CV upload lives in candidateApi (FileUploader)
- **duplicateOf:** null

---

## Description (verbatim from Linear)

## Goal

Make **candidate creation** (`POST /candidates`) go through the same `candidateApi` module as CV upload, so `AddCandidateForm` no longer owns raw `fetch` + ad-hoc status branching. **Canonical terms:** *candidate creation* = JSON POST; *CV upload* = multipart POST (already routed through `candidateApi` in NOV-11).

## Scope

* Extend `frontend/src/services/candidateApi.ts` with `createCandidate(payload)` (name the payload type to match the JSON body built in `AddCandidateForm` after date normalization).
* Migrate `frontend/src/components/AddCandidateForm.js` `handleSubmit` to call `createCandidate` only (no `fetch` / `getApiBaseUrl` for this endpoint).
* Preserve behavior for **201**, **400** (parse JSON `message` if present), **500**, and generic failures — or improve with **one** consolidated error mapping inside `candidateApi`.
* **User-facing language:** per `CONTEXT.md`, **Spanish-first** in the form `Alert`; service layer can use neutral errors — form wraps network/5xx/generic in Spanish; **400** may surface server `message` when human-readable.
* **Error lifecycle:** clear shared `error` at the **start** of `handleSubmit` (and any other retry path) per `CONTEXT.md` — do not rely only on Alert dismiss.
* **Out of scope:** removing `candidateService.js`, optional `addCandidateWithOptionalCv` orchestration, migrating the form to TypeScript.

## Env

* `REACT_APP_API_URL` / `getApiBaseUrl()`.

## Acceptance criteria

* Successful submit still shows the same **success** UX (or strictly better messaging).
* Validation errors from the API (**400**) still surface **actionable** text for the user.
* `AddCandidateForm` contains **no** direct `fetch(${getApiBaseUrl()}/candidates)`.
* **Grill check:** If the API returns a body that is not JSON on error, behavior must be defined (e.g. fall back to `res.text()` / status) — document the chosen behavior in the PR.
* **Language:** User-visible errors remain **Spanish-first** as defined in repository root `CONTEXT.md` (add-candidate errors).
* **Stale errors:** a new submit attempt clears the previous `error` before the async work runs.

## Unit (RTL) / Jest — test-first

* Extend `candidateApi.test.ts` (TDD).
* **RED scenarios (write first):**
  * **201:** parses JSON if needed; resolves without throwing.
  * **400:** rejects with message derived from response body when JSON `message` exists.
  * **500** / other `!res.ok`: rejects with clear error.
  * **Network** `TypeError`: same class of message as upload + board APIs.
* **GREEN:** implement `createCandidate` until tests pass.
* Optional: RTL test that submit calls the service (mock `../services/candidateApi`) — only if it locks a regression; prefer service boundary tests.

## E2E (Playwright)

* Keep add-candidate flow green (`baseURL` `http://localhost:3000`); run if this route is covered.

## Graphify

* `sendCandidateData`, `getApiBaseUrl`, `candidateService.js` cluster — consolidation prepares removal of duplicate axios path.

## Definition of done

* `pnpm run typecheck` and `CI=true pnpm test` pass from `frontend/`.

## Dependency

* **Blocked by:** NOV-11 (same `candidateApi.ts` file; avoid parallel conflicting edits).

## Domain note

* **Add-candidate errors (language)** and **shared** `error` lifecycle are recorded in repository root `CONTEXT.md`.

---

## Comments

None at export time (`list_comments` returned empty).
