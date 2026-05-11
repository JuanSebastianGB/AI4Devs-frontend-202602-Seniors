# Harness Engineering Tests

## Contract Verification Tests

### Test 1: Contract inputs are correctly defined
- **Skill**: harness-engineering
- **Test**: Verify the Contract section has `codebase_path?`, `target_maturity?`, and `stack?` as inputs
- **Expected**: All three inputs are present with correct types
- **Validation**: Parse SKILL.md Contract block, check for Inputs section

### Test 2: Contract outputs include readiness_report and implemented_artifacts
- **Skill**: harness-engineering
- **Test**: Verify the Contract section defines `readiness_report` and `implemented_artifacts` outputs
- **Expected**: Both outputs are present with correct structure
- **Validation**: Parse SKILL.md Contract block, check for Outputs section

### Test 3: Contract constraints include MUST/SHOULD/NEVER rules
- **Skill**: harness-engineering
- **Test**: Verify the Contract section has MUST, SHOULD, and NEVER constraints
- **Expected**: At least one of each: MUST, SHOULD, NEVER
- **Validation**: Parse SKILL.md Contract block, check Constraints section

## Workflow Tests

### Test 4: Workflow has 5 steps with correct IDs
- **Skill**: harness-engineering
- **Test**: Verify workflow steps are: explore_codebase, assess_pillars, identify_gaps, implement_harness, verify_harness
- **Expected**: All 5 steps present in correct order
- **Validation**: Parse SKILL.md Workflow section

### Test 5: explore_codebase step uses parallel subagents
- **Skill**: harness-engineering
- **Test**: Verify explore_codebase step has `parallel: true` and 3 subagent outputs
- **Expected**: tech_stack_findings, quality_findings, workflow_findings outputs
- **Validation**: Parse SKILL.md step 1

### Test 6: verify_harness step uses bash action_type
- **Skill**: harness-engineering
- **Test**: Verify final step uses `action_type: "bash"` for verification
- **Expected**: verify_harness has bash action with verification commands
- **Validation**: Parse SKILL.md step 5

## Pillar Scoring Tests

### Test 7: 8 pillars are defined with correct names
- **Skill**: harness-engineering
- **Test**: Verify all 8 pillars exist: Style & Validation, Testing, Git Hooks, Documentation, Agent Config, Code Quality, Dev Environment, Agentic Workflow
- **Expected**: All 8 pillars present with descriptions
- **Validation**: Parse SKILL.md Pillar table

### Test 8: 5 maturity levels are defined with correct thresholds
- **Skill**: harness-engineering
- **Test**: Verify levels 1-5 with names: Bare, Basic, Enforced, Automated, Autonomous
- **Expected**: All 5 levels present with correct thresholds
- **Validation**: Parse SKILL.md Maturity Levels table

## Reference Tests

### Test 9: References section has at least 5 sources
- **Skill**: harness-engineering
- **Test**: Verify at least 5 reference links are present
- **Expected**: OpenAI, Anthropic, jrenaldi79, walkinglabs, Factory.ai references
- **Validation**: Parse SKILL.md References section

## Output Format Tests

### Test 10: Output Format section describes readiness report structure
- **Skill**: harness-engineering
- **Test**: Verify output format includes maturity level, pillar scores, gaps, quick wins
- **Expected**: All four elements present in output format description
- **Validation**: Parse SKILL.md Output Format section

### Test 11: Quick wins section is present in identify_gaps
- **Skill**: harness-engineering
- **Test**: Verify quick wins examples are provided
- **Expected**: At least 2 quick win examples listed
- **Validation**: Parse SKILL.md Step 3 details

## Layout Template Tests

### Test 12: CLAUDE.md templates are provided
- **Skill**: harness-engineering
- **Test**: Verify Global and Project CLAUDE.md templates exist
- **Expected**: Both templates present with proper structure
- **Validation**: Parse SKILL.md Layout Templates section

### Test 13: Pre-commit and pre-push hook templates exist
- **Skill**: harness-engineering
- **Test**: Verify both hook templates are provided
- **Expected**: Pre-commit and pre-push hook templates present
- **Validation**: Parse SKILL.md Hook templates

### Test 14: Path-scoped rules format is documented
- **Skill**: harness-engineering
- **Test**: Verify tdd.md and file-size.md rule examples exist
- **Expected**: Both rule examples present
- **Validation**: Parse SKILL.md Path-Scoped Rules section

## Routing Tests

### Test 15: When to use has at least 4 triggers
- **Skill**: harness-engineering
- **Test**: Verify at least 4 distinct when-to-use triggers
- **Expected**: Bootstrapping, assessing, implementing, improving + catch phrases
- **Validation**: Parse SKILL.md When to use section

### Test 16: When not to use has at least 4 skill references
- **Skill**: harness-engineering
- **Test**: Verify at least 4 alternative skill recommendations
- **Expected**: triage-issue, tdd, brainstorming, agent-architecture
- **Validation**: Parse SKILL.md When not to use section