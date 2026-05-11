# Sudolang Reference

## Contract Syntax

```sudo
Contracts {
  Inputs { field1: type, field2?: type }
  Outputs { result: type }
  Constraints {
    MUST: "constraint text"
    SHOULD: "constraint text"
    NEVER: "constraint text"
  }
}
```

## Workflow Syntax

```sudo
Workflow {
  step1_name
  step2_name
  step3_name
}
```

With details:
```sudo
workflow:
  name: "workflow-name"
  description: "one-line description"
  goals: ["goal1", "goal2"]
  non_goals: ["non-goal1"]
  constraints: ["constraint1"]
  context: { template_ref: "refs/path.md" }
  steps:
    - id: "step_id"
      description: "step description"
      agent: "default"
      action_type: "clarify|author|checkpoint|self_review"
      inputs: ["input1", "input2"]
      outputs:
        - name: "output_name"
          type: "type"
```

## Skill Structure

```
skill-name/
├── SKILL.md           # Required: name, description, contract, workflow
├── refs/              # Optional: on-demand depth
│   └── topic.md
└── scripts/           # Optional: deterministic helpers
```

## Frontmatter

```yaml
---
name: skill-name
description: >
  One-line capability summary.
  Use when trigger1, trigger2, or trigger3.
---
```

## Best Practices

1. Keep SKILL.md under ~100 lines; push detail to refs/
2. Description should be 50-200 chars, keyword-rich
3. Use "Use when..." for routing triggers
4. Prefer MUST/SHOULD/NEVER constraints over prose
5. Step ids should be snake_case verbs