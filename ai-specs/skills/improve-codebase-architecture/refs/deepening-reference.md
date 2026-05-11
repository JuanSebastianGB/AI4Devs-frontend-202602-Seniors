# Deepening reference

## Dependency categories

When assessing a candidate for deepening, classify its dependencies:

### 1. In-process

Pure computation, in-memory state, no I/O. Always deepenable — merge modules and test directly.

### 2. Local-substitutable

Dependencies with local test stand-ins (e.g. PGLite for Postgres, in-memory filesystem). Deepenable if the substitute exists; tests run the stand-in in-suite.

### 3. Remote but owned (ports and adapters)

Your own services across a network boundary. Define a port at the module boundary; inject transport. Tests use an in-memory adapter; production uses real HTTP/gRPC/queue adapters.

Recommendation shape: define a shared interface (port), HTTP adapter for production, in-memory adapter for testing, so logic tests as one deep module despite deployment boundaries.

### 4. True external (mock)

Third-party services you do not control (Stripe, Twilio, etc.). Mock at the boundary; inject a port; tests supply a mock implementation.

## Testing strategy

**Replace, do not layer.**

- Old unit tests on shallow modules are disposable once boundary tests exist — delete redundant shallow tests
- New tests live at the deepened module’s public interface
- Assert observable outcomes through the interface, not internal state
- Tests should survive internal refactors — behavior, not layout

## Issue template

Use this structure in the body. **Pass it via `--body-file`, never inline `--body`** — multi-line content passed inline causes shell quoting failures (unmatched quotes, heredoc in command substitution parsing errors). Write the body to a temp file, then use `gh issue create --body-file /path/to/body.md`.

```markdown
## Problem

Describe the architectural friction:

- Which modules are shallow and tightly coupled
- What integration risk exists in the seams between them
- Why this makes the codebase harder to navigate and maintain

## Proposed Interface

The chosen interface design:

- Interface signature (types, methods, params)
- Usage example showing how callers use it
- What complexity it hides internally

## Dependency Strategy

Which category applies and how dependencies are handled:

- **In-process**: merged directly
- **Local-substitutable**: tested with [specific stand-in]
- **Ports & adapters**: port definition, production adapter, test adapter
- **Mock**: mock boundary for external services

## Testing Strategy

- **New boundary tests to write**: behaviors to verify at the interface
- **Old tests to delete**: shallow module tests that become redundant
- **Test environment needs**: local stand-ins or adapters required

## Implementation Recommendations

Durable guidance not tied to current file paths:

- What the module should own (responsibilities)
- What it should hide (implementation details)
- What it should expose (the interface contract)
- How callers should migrate to the new interface
```
