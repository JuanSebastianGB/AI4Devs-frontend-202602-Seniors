# LTI recruiting (frontend exercise)

Bounded context for the AI4Devs LTI frontend exercise: positions, applications, and interview flow.

## Language

**Interview stage (canonical)**:
The primary key of an **Interview step** row (`InterviewStep.id`, integer). Stored on each **Application** as `currentInterviewStep` in the database and sent on stage updates in the PUT body.
_Avoid_: Using the step display name as the write payload without a documented name-to-id mapping.

**Interview step (display)**:
The human-readable step name returned on candidate listings (e.g. `"Technical Interview"`). Used for UI labels and column headers; not authoritative for persistence.
_Avoid_: Calling this field “stage id” in API docs — it is a name string on GET.

**Application**:
A candidate’s enrollment in a specific **Position**, holding `applicationId`, `candidateId`, and the current interview stage FK.
_Avoid_: Confusing with **Candidate** alone — stage updates require both candidate path id and `applicationId` in the body per server contract.

**Unmatched stage (UI)**:
When the candidates API returns a **Interview step (display)** string that does not match any step name in the position’s interview flow — the card is shown in the **Unknown** lane (see Decisions), not merged into a normal column.

**Average score (display)**:
The mean of interview scores for that application, shown on the candidate card with **one** fixed decimal digit (see Decisions).

## Relationships

- A **Position** has one **Interview flow** with ordered **Interview steps** (columns).
- An **Application** belongs to one **Position** and one **Candidate**, and points to exactly one **Interview stage (canonical)** at a time.

## Example dialogue

> **Dev:** “After drag-and-drop, should the client send the column title or an id?”
> **Domain expert:** “Send the **Interview stage (canonical)** — the step’s numeric id. The title is only for display.”

## Decisions

- **Add-candidate flow: upload OK, create fails:** **CV upload** (`POST /upload`) and **candidate creation** (`POST /candidates`) are **independent steps**. If upload succeeds but create fails (network, 5xx, validation), the client keeps the returned **`filePath` / `fileType`** and the user may **retry submit** without uploading again — unless the backend documents that orphan files expire or become invalid (then document that exception and adjust UX). No automatic rollback of server-side files from the frontend in the default case.
- **CV upload failure (UI):** Errors from **`POST /upload`** must be **visible** in the add-candidate flow — same pattern as submit errors (e.g. parent `Alert` via a callback such as **`onUploadError`** from `FileUploader` to `AddCandidateForm`). **Avoid** relying on **`console.error` alone** for user-facing failures.
- **Add-candidate errors (language):** User-visible copy in **`AddCandidateForm`** stays **Spanish-first**. The API module may throw **`Error`** with neutral or English technical text; the **form** (or a thin mapper) wraps **network**, **5xx**, and **generic** failures with **Spanish** framing. For **400** validation, show the server’s **`message`** when it is clearly meant for humans (e.g. parsed JSON `message`); do not blindly prepend English-only strings that duplicate backend wording.
- **Add-candidate shared `error` state:** Clear the form **`error`** at the **start** of each user action that can fix or supersede the failure: **new upload attempt** (e.g. click upload), **new submit**, and when **changing the selected file** in the CV input. Keep **dismiss** on `Alert` as an additional path if the component is dismissible — do not rely on dismiss alone to avoid stale messages after retry. On **successful CV upload** (callback with stored file metadata), clear **`error`** entirely — even if it came from a prior **submit** failure — so the user is not stuck with a stale message after fixing the CV.
- **Position detail URL (browser):** `/positions/:positionId` — plural, consistent with the positions list. JSON requests still use the API prefix `/position/:id/...`.
- **Failed stage update (after drag):** **Rollback** — revert the card to the column that still matches server state; show a concise error (inline or toast). Do not leave the board showing a stage the server did not accept.
- **Candidate step name not in flow:** Show their card in a dedicated **Unknown / unmatched** lane (or strip) with a visible warning — never drop them into an arbitrary real stage and never hide them. Place that lane **after** all regular stages (right on desktop, **bottom** when columns stack on mobile).
- **Column order:** Sort steps by **`orderIndex` ascending**, then **`id` ascending** as a stable tie-break when `orderIndex` duplicates. Apply the same order on mobile (stacked).
- **After successful stage PUT:** **Refetch** `GET /position/:id/candidates` only — keep display strings and scores aligned with the server without reloading the interview flow.
- **Unknown lane interaction:** **Not a drop target** — display-only bucket for unmatched step names. Cards may be **dragged from Unknown** into a real stage column (valid **PUT**). Do not accept drops onto Unknown.
- **Back control:** Always navigate to **`/positions`** (e.g. `Link` or `navigate('/positions')`) — do not rely on browser history alone.
- **Initial load (flow + candidates):** If **interview flow** fails → **full-page error** with retry (no board — columns are undefined). If flow succeeds but **candidates** fails → render columns (empty) with a clear error and **retry candidates** only.
- **Drag UI timing:** **Optimistic** — on drop, show the card in the target column immediately, then **PUT**; on failure **rollback** and show error; on success **refetch candidates** as already decided.
- **Average score on cards:** Format with **exactly one** decimal place (e.g. `4.0`, `3.7`) for stable, readable scores.

## Flagged ambiguities

- External exercise handout shows `PUT /candidates/:id/stage` and string `"3"` — **resolved**: this repo uses `PUT /candidates/:id` with **integer** `currentInterviewStep` (step id) and integer `applicationId`; path `:id` is the **Candidate** id.
- **Orphan files after successful `POST /upload` and failed `POST /candidates`:** server-side retention, expiry, or invalidation of stored CV paths is **not specified** in this context. The client follows **Decisions** (retry create with existing `filePath` / `fileType`) until product/backend documents otherwise.

## Grill session (closed)

Add-candidate / **`candidateApi`** product rules from the May 2026 grill are integrated into **Decisions** above (not duplicated here). Implementation is tracked in Linear as **NOV-11** → **NOV-12** → **NOV-13** (vertical slices).
