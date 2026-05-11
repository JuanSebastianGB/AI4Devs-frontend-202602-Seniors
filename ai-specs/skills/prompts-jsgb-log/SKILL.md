---
name: prompts-jsgb-log
description: >
  Append the current chat’s user requests to prompts/prompts-jsgb as English Markdown.
  Use when the user wants to record what they asked the project guide, or says
  “log prompts”, “guardar lo pedido”, “prompts-jsgb”, or invokes this skill.
---

# Prompts JSGB log

## Purpose

Capture **everything the user has asked for** in the **current chat** (the session where this skill runs), synthesize it into a single well-structured **English** Markdown entry, and **append** it to the repo file:

`prompts/prompts-jsgb`

## When to use

- The user explicitly wants a durable record of their requests to the guide for this project.
- The user references **prompts-jsgb** or this skill by name.

## When not to use

- The user only wants a one-off summary in chat with no file write.
- The task is unrelated to logging user intent (implement features, fix bugs, etc.) unless they also ask to log.

## Workflow

1. **Use conversation context** — Treat the visible **current chat** as the source of truth: all **user** messages (including refinements and follow-ups). Ignore assistant filler unless it restates a user requirement you need to clarify.
2. **Synthesize requests** — Produce a concise but complete list of **actionable asks** and **constraints** (what to build, how, where, languages, tools, “do not” rules). Merge duplicates; keep chronological order of themes if it helps readability.
3. **Read the existing log** — Open `prompts/prompts-jsgb` so new content **appends** after the latest `---` separator and does not overwrite prior entries.
4. **Write the append block** — Insert **before** the final trailing newline of the file (or after the last `---`), using this shape (all **English**):

   ```markdown
   ## Entry — YYYY-MM-DD (optional short label)

   **Source:** Current Cursor chat session (prompts-jsgb-log skill).

   ### User requests

   - …
   - …

   ### Notes (optional)

   - …

   ---
   ```

   - Use **UTC or local date** consistently; prefer ISO `YYYY-MM-DD` in the heading.
   - Use `###` subsections only if they add clarity; keep bullets tight and scannable.
   - If the user wrote in another language, **translate** the substance into English; do not copy-paste raw chat verbatim unless they asked for a quote.
5. **Confirm in chat** — One short message: what was appended and the path `prompts/prompts-jsgb`.

## Constraints

- **Append only** — Never delete or rewrite previous entries unless the user explicitly asks to fix an error in the log.
- **User intent only** — Log what the **user** requested, not the assistant’s proposed plan, unless the user adopted it as a requirement.
- **Repo path** — File is always at repository root: `prompts/prompts-jsgb` (same content whether accessed via `.cursor/skills` symlink tree or `ai-specs/skills`).
- **Formatting** — Valid Markdown, consistent headings and list style with the rest of the file.

## Quality check

Before saving: reread the new block — would another reader understand **what to do** without opening the chat? If not, tighten bullets.
