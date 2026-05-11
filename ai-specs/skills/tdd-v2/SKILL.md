---
name: tdd-v2
description: >
  Test-driven development with red-green-refactor loops. Use when user says TDD, test-first,
  write tests before code, red-green, or needs a failing test to drive implementation.
---

# TDD-v2

## Quick start

```
1. RED  → write failing test for desired behavior
2. GREEN → write minimal code to pass the test
3. REFACTOR → clean code while tests stay green
```

## Workflows

### red-green-refactor loop
```
1. Identify a small unit of behavior to test
2. RED: Write a test that describes the expected behavior (must fail) — 30s to 2min
3. GREEN: Write the minimal code to make the test pass (no more) — 1 to 5min
4. REFACTOR: Improve code quality without breaking behavior — 2 to 10min
5. Repeat until implementation is complete
```

### test-first bugfix
```
1. Write a test that reproduces the bug (test must fail)
2. GREEN: Write minimal fix to make test pass
3. REFACTOR: Clean up if needed
4. Verify all tests still pass
```

## When to use

Trigger phrases: "TDD", "test-first", "test first", "write failing test", "red green refactor", "red-green-refactor", "green phase", "refactor phase", "write tests before code", "test-driven development", "needs a failing test to drive implementation", "write a test for", "add tests first", "test should fail"

## Contract

```sudo
Contracts {
  Inputs {
    user_goal: string          # User's implementation goal or bug description
    language?: string         # e.g., "python", "javascript", "go"
    test_framework?: string   # e.g., "pytest", "jest", "go test"
  }

  Outputs {
    test_code: string         # Complete failing test code
    implementation_code: string  # Minimal implementation to pass
    loop_count: number        # RED→GREEN→REFACTOR iterations
    final_state: "pass" | "fail"  # Whether final tests pass
  }

  Errors {
    invalid_goal: "Cannot derive testable behavior from goal"
    no_framework: "Assume pytest for Python, jest for JS, go test for Go"
    empty_implementation: "Implementation must not be empty after GREEN"
  }

  Constraints {
    MUST: "Write failing test before any implementation code"
    MUST: "Write minimal implementation to pass the test, no extra behavior"
    MUST: "Run tests after GREEN and REFACTOR to confirm green state"
    MUST: "Keep loop_count accurate — increment each RED→GREEN→REFACTOR cycle"
    SHOULD: "Keep test and implementation pairs small and focused"
    SHOULD: "Prefer assertion messages that describe expected behavior"
    SHOULD: "Use AAA pattern: Arrange inputs, Act on system, Assert outcomes"
    NEVER: "Skip RED phase and write implementation without a failing test"
    NEVER: "Add behavior in GREEN phase beyond what the test requires"
    NEVER: "Refactor in ways that could change behavior (tests must stay green)"
  }
}
```

## Loop invariant

```
RED (failing test) → GREEN (passing) → REFACTOR (still passing) → repeat
```

Each cycle:
- **RED**: Test documents intent; must fail on current code
- **GREEN**: Code fulfills intent; no speculation
- **REFACTOR**: Code expresses intent more clearly; behavior unchanged

## Gotchas

- **NEVER** write implementation before a failing test — the RED phase is non-negotiable
- **GREEN phase** must not add speculative behavior — only what's needed to pass
- **REFACTOR phase** must not change behavior — only improve structure
- Don't skip running tests after GREEN to confirm green state
- Don't write verbose tests — keep assertions focused on single behaviors

## Advanced

See [refs/tdd-patterns.md](refs/tdd-patterns.md) for:
- Stub, mock, and fake object strategies
- Triangulation technique
- Transformation priority premise
- Common test structure patterns by language
- Arrange-Act-Assert (AAA) pattern
- Given-When-Then (BDD) scenarios
- Exception testing patterns
- Parameterized test patterns

## References

- [Kent Beck — TDD by Example](https://www.goodreads.com/book/show/1873025.Test_Driven_Development_by_Example)
- [Robert Martin — Clean Code](https://www.goodreads.com/book/show/48452913-clean-code)
- [Gerard Meszaros — xUnit Test Patterns](http://xunitpatterns.com/)
- [xUnit.net Documentation](https://xunit.net/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)