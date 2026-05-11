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
