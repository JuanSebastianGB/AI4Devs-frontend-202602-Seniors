---
name: improve-codebase-architecture
description: >
  Explore a codebase for architectural improvement with emphasis on deepening shallow modules for testability and agent navigation (John Ousterhout-style deep modules).
  Use when improving architecture, finding refactor opportunities, consolidating coupled modules, or making a codebase more AI-navigable.
---

# Improve Codebase Architecture

## When to use

- Refactoring or consolidating tightly coupled modules
- Raising testability by testing at module boundaries instead of internals
- Surfacing architectural friction for RFC-style tracking
- Turning shallow, wide interfaces into smaller surfaces over richer implementations
- Making large codebases easier for AI agents to explore and reason about

## When not to use

- Greenfield work with nothing meaningful to explore yet
- Cosmetic or formatting-only churn unrelated to structure
- Domains that need specialized compliance or threat-modeling playbooks first
- Emergency hotfixes where multi-step exploration is too slow
- Replacing product or domain discovery with a pure code tour

## Contracts

```sudo
Contracts {
  Inputs {
    codebase_path?: string
    user_goal?: string
    candidate_choice?: integer
    interface_choice?: string
  }
  Outputs {
    exploration_notes: string
    deepening_candidates: List[{
      cluster: string,
      coupling_rationale: string,
      dependency_category: enum[in-process, local-substitutable, ports-and-adapters, true-external],
      test_impact: string
    }]
    problem_space_brief: string
    interface_alternatives: List[{
      signature: string,
      usage_example: string,
      hidden_complexity: string,
      dependency_strategy: enum[in-process, local-substitutable, ports-and-adapters, true-external],
      trade_offs: string
    }]
    github_issue_url: string
  }
  Constraints {
    MUST attempt exploration using Agent tool with subagent_type Explore
    MUST surface friction encountered while exploring as primary signal
    MUST list deepening candidates before proposing final interfaces; each candidate includes Cluster, why modules are coupled, dependency category per refs/deepening-reference.md, and test impact (what shallow tests boundary tests would replace)
    MUST NOT show interface proposals in the first candidate list; end that step by asking which candidate to explore
    MUST, after the user picks a candidate, write a user-facing problem-space brief (constraints on any new interface, dependencies, rough illustrative sketch — sketch grounds constraints, not a final API), then immediately run parallel design subagents without waiting for user reply on that brief
    MUST create the refactor RFC using gh issue create and the template in refs/deepening-reference.md without asking the user to approve issue text beforehand; share the URL after creation. **Use `--body-file` (not `--body`) for the issue body** — multi-line content passed via `--body` with heredoc/command-substitution causes shell quoting failures; write the body to a temp file and pass its path.
    MUST NOT use the Agent tool for implementation work (writing code, modifying files, running tests) in the same session as the RFC creation. The RFC is the final output of this session — it triggers a Ralph cycle that the **user runs manually**. The agent's job ends at step 7. Only exception: user explicitly says "implementa", "implement", "do it", or "local mode" — this must be an explicit statement, never assumed.
    MUST spawn at least three Agent-tool subagents in parallel with distinct briefs and design constraints (minimal interface vs maximal flexibility vs best default path; add ports-and-adapters variant when cross-boundary deps dominate) — these subagents run AFTER step 3 (user picks candidate) and AFTER the problem brief in step 4; they populate step 5 for comparison, they are NOT run before step 3.
    MUST have each design subagent return signature, usage example, hidden complexity, dependency strategy per refs/deepening-reference.md, and trade-offs; compare sequentially, recommend or hybridize with a clear opinion
    SHOULD ask the user to pick a candidate after the numbered list
    SHOULD ask the user to pick an interface or accept the recommendation after comparison
    NEVER treat pure-function extractions as sufficient if orchestration bugs live at call sites — call that out in candidates when seen
  }
}
```

## Workflow

```sudo
Workflow {
  step1_explore_codebase_prefer_graph_fallback_to_explore_subagent
  step2_present_numbered_candidates_cluster_coupling_category_test_impact_no_interfaces_yet
  step3_user_selects_candidate
  step4_write_problem_space_brief_then_spawn_parallel_interface_subagents
  step5_collect_compare_and_recommend_interface_designs
  step6_user_selects_interface_or_accepts_recommendation
  step7_create_github_rfc_issue_via_gh_cli_share_url
}
```

**Gate rules** — each step blocks the next until complete:
- Step 1 must surface friction and produce deepening candidates before step 2 begins
- Step 2 must end with a numbered list and user selection before step 3
- Step 3 user selection gates step 4 (no design subagents before candidate is chosen)
- Step 4 writes the problem brief, then spawns design subagents; user confirms interface in step 6
- Step 6 user confirms interface, then step 7 (RFC creation) must happen before any implementation
- **Hard gate**: step 7 must complete before Agent tool is used for writing code or modifying files



## Red Flags

- Agent tool used for code writing or file modifications before step 7 (RFC creation)
- Interface proposals appearing in the deepening candidates list (step 2)
- Design subagents spawned before user selects a candidate
- Dependency category mislabeled (e.g., marking in-process as "ports and adapters")
- Shell quoting errors from using `--body` instead of `--body-file` with `gh issue create`
- Shallow unit tests treated as sufficient boundary coverage

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The graph is good enough, no need for Explore fallback" | Graph tools have coverage gaps; Explore subagent fills them |
| "Interface proposals in candidates list saves time" | Collapses decision space; separates exploration from design |
| "I'll implement the RFC right away" | RFC triggers Ralph cycle; agent's job ends at step 7 |
| "Orchestration bugs don't need special handling" | Call-site bugs require surfacing, not just function extraction |

## Gotchas / risks

- Graph tools are cheaper and faster than Explore subagent for structural context — use them first; reserve Explore for gaps graph doesn't cover
- Skipping the candidate list or mixing in API proposals early collapses the decision space the skill is for
- Mis-labeling dependency category misroutes adapter vs merge advice — re-read refs when unsure
- Parallel subagents need non-overlapping design constraints or you get redundant options
- Rough sketches in step 4 are not commitments; avoid locking the team into accidental APIs in prose
- **Shell quoting pitfall**: when creating GitHub issues via `gh issue create`, always use `--body-file` for multi-line content — never `--body "..."` with inline heredocs or command substitutions; zsh/bash misinterpret nested quoting contexts causing `unmatched "` errors; write body to a temp file and pass its path to `--body-file`
- **RFC-before-code gate**: the Agent tool must not be used for implementation (code writing, file modifications, test running) until step 7 creates the RFC on GitHub. The RFC is the contract that triggers the Ralph workflow. Exception: only when the user explicitly says "local mode" or "no GitHub" — never assumed.

## References

- [Dependency categories, testing strategy, issue template](refs/deepening-reference.md)
- [John Ousterhout — A Philosophy of Software Design (deep modules)](https://www.cs.virginia.edu/~jh6jf/textbook/Philosophy-of-Software-Design.pdf)
- [OpenCode Skills Documentation](https://open-code.ai/docs/en/skills)


## Verification

After completing the skill's process, confirm:
- [ ] Step 1 surfaced friction and produced deepening candidates
- [ ] Step 2 ended with a numbered list and user selection
- [ ] Step 3 user selection was recorded before step 4 began
- [ ] Step 4 wrote problem brief, then spawned design subagents in parallel
- [ ] Step 5 collected and compared interface designs
- [ ] Step 6 user confirmed interface selection
- [ ] Step 7 created GitHub RFC issue and shared URL
- [ ] No implementation work (Agent tool for code writing) occurred before step 7
- [ ] All deepening candidates included Cluster, coupling rationale, dependency category, and test impact