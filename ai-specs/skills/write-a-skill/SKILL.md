---
name: write-a-skill
description: >
  Author new agent skills with Sudolang contracts, workflows, and proper structure.
  Use when user wants to create, write, or build a new skill, or author a skill spec in Sudolang.
---

## Purpose
Author **new** skills: folder layout, tight `SKILL.md`, optional `refs/` and `scripts/`. See [refs/write-a-skill-guide.md](refs/write-a-skill-guide.md) for step details, review checklist, and routing guidelines.

## Triggers
- "I want to build/create/write/make/author a skill"
- "I need a new skill for X"
- "Skill spec in Sudolang"
- "How do I structure a skill folder"

## Stopping conditions
- User approves draft artifact
- User abandons the session
- Skill folder layout and draft SKILL.md produced

## Gotchas
- Only edit SKILL.md unless companion files are specifically needed
- Form matter (YAML frontmatter) is sacred — never change name/description
- Keep SKILL.md lean — offload rare paths and long examples to refs/
- Bad description brevity hurts routing — be specific, not generic
- Never skip review-with-user checkpoint — user must approve draft
- Do not refactor unrelated repo skills or replace sudolang-skillreducer

## Contract
```sudo
Contracts {
  Inputs {
    user_request: string
    conversation_context?: string
    profile?: "coding" | "generic" | "prd"
    include_scripts?: boolean
    reference_paths?: List<string>
  }

  Outputs {
    skill_folder_layout: string
    sudolang_authoring_spec: string
    draft_artifacts: {
      SKILL_md: string
      ref_files?: List<{ path: string, content: string }>
      script_files?: List<{ path: string, content: string }>
    }
  }

  Constraints {
    MUST: "Follow workflow steps in order unless user aborts."
    MUST: "Frontmatter name + description match final triggers; description is routing-critical."
    MUST: "Keep SKILL.md lean; move detail over ~100 lines or rare paths to refs/."
    SHOULD: "Prefer one-level-deep links from SKILL.md into refs/."
    NEVER: "Ship time-sensitive info (dates, version numbers) without a refresh plan."
  }
}
```

## Workflow
```sudo
workflow:
  name: "author-agent-skill"
  description: "From intent to merge-ready skill folder with Sudolang contract."
  profile: "generic"
  goals:
    - "Capture scope, triggers, scripts vs prose-only, and ref material."
    - "Emit a concrete folder layout and SKILL.md + optional refs/scripts."
    - "Validate against the review checklist before handoff."
  non_goals:
    - "Refactor unrelated repo skills."
    - "Replace sudolang-skillreducer for aggressive compression passes."
  context:
    template_ref: "refs/skill-template.md"
  steps:
    - id: "gather-requirements"
      description: "Ask what domain, use cases, script needs, and references."
      agent: "default"
      action_type: "clarify"
      inputs: ["user_request", "conversation_context"]
      outputs:
        - name: "requirements_notes"
          type: "string"
    - id: "draft-skill"
      description: "Propose SKILL.md, refs/, scripts/ per structure rules."
      agent: "default"
      action_type: "author"
      inputs: ["requirements_notes", "profile", "include_scripts", "reference_paths"]
      outputs:
        - name: "draft_artifacts"
          type: "object"
    - id: "review-with-user"
      description: "Present draft; confirm coverage, clarity, split vs inline tradeoffs."
      agent: "supervisor"
      action_type: "checkpoint"
      inputs: ["draft_artifacts"]
      outputs:
        - name: "approval_or_revisions"
          type: "string"
    - id: "self_review"
      description: "Run review checklist; fix gaps before final output."
      agent: "default"
      action_type: "self_review"
      inputs: ["draft_artifacts", "approval_or_revisions"]
      outputs:
        - name: "validation_notes"
          type: "string"
```

Full SKILL.md body example: [refs/skill-template.md](refs/skill-template.md). Sudolang syntax: [refs/sudolang-reference.md](refs/sudolang-reference.md). Validation: [scripts/validate-skill.sh](scripts/validate-skill.sh).

## Agent self-check
- [ ] Collected requirements before drafting
- [ ] Draft includes frontmatter, contract, workflow, and skill structure
- [ ] Received explicit user approval on draft
- [ ] Ran review checklist and fixed gaps
- [ ] Form matter (name + description) never modified