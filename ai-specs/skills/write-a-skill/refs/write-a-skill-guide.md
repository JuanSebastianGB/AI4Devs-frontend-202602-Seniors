# write-a-skill Authoring Guide

## Step Details

### 1. gather-requirements
Ask what domain, use cases, script needs, and references to bundle. Probe for:
- Skill name and trigger keywords
- Whether it authors new skills or performs existing ones
- Script vs prose-only tradeoff
- Reference materials to bundle

### 2. draft-skill
Propose SKILL.md, refs/, scripts/ per structure rules:
- SKILL.md: frontmatter + contract + lean workflow + inline gotchas
- refs/: offload rare paths, long examples, deep context
- scripts/: deterministic helpers (validate, format)
Link refs one level deep from SKILL.md.

### 3. review-with-user (agent: supervisor)
Present draft; confirm:
- Coverage of stated triggers
- Clarity of contract
- Split vs inline tradeoff decision
Wait for explicit approval before finalizing.

### 4. self_review
Run review checklist; fix gaps before handoff.

## Review Checklist

- [ ] Description includes triggers (`Use when...`)
- [ ] `SKILL.md` stays lean; heavy detail in `refs/`
- [ ] No stale time-bound info in core file
- [ ] Consistent terminology + concrete examples
- [ ] Ref links at most one hop from `SKILL.md`
- [ ] Contract has MUST/SHOULD/NEVER constraints
- [ ] Workflow steps have clear inputs/outputs

## Routing Guidelines

The YAML `description` is often the **only** signal agents use to pick this skill.

- First sentence: capability (one line)
- Second: `Use when ...` with concrete triggers (keywords, contexts, file types)
- Max ~1024 characters, third person

**Good:** `Extract text and tables from PDFs, merge docs. Use when the user mentions PDFs, forms, or extraction.`

**Bad:** `Helps with documents.` (not distinguishable.)

## Scripts vs Refs Split

**Scripts** — add when work is deterministic (validate, format), repeated verbatim, or needs explicit error handling.

**Refs** — split when SKILL.md would exceed ~100 lines, domains differ strongly, or advanced paths are rare.

## Skill Folder Structure

```
skill-name/
├── SKILL.md           # Main instructions (required)
├── refs/              # On-demand depth (optional)
│   └── ...
└── scripts/           # Deterministic helpers (optional)
```

## Sudolang Contract Template

```sudo
Contracts {
  Inputs { field: type, optional_field?: type }
  Outputs { result: type }
  Constraints {
    MUST: "constraint"
    SHOULD: "constraint"
    NEVER: "constraint"
  }
}

Workflow {
  step1
  step2
  step3
}
```

## Non-Goals (do not do)
- Refactor unrelated repo skills
- Replace sudolang-skillreducer for aggressive compression passes