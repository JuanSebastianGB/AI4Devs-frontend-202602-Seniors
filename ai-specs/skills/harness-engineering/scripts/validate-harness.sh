#!/bin/bash
# validate-harness.sh — validates harness-engineering skill structure

set -e

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILL_MD="$SKILL_DIR/SKILL.md"

echo "=== Harness Engineering Skill Validation ==="

# Check YAML frontmatter
echo ""
echo "[1/8] Checking YAML frontmatter..."
if grep -q "^name: harness-engineering" "$SKILL_MD" && grep -q "^description:" "$SKILL_MD"; then
    echo "✓ Frontmatter present and correct"
else
    echo "✗ Frontmatter missing or incorrect"
    exit 1
fi

# Check required sections
echo ""
echo "[2/8] Checking required sections..."
sections=("When to use" "When not to use" "Contract" "Workflow" "References")
for section in "${sections[@]}"; do
    if grep -q "## $section" "$SKILL_MD"; then
        echo "  ✓ $section"
    else
        echo "  ✗ $section MISSING"
        exit 1
    fi
done

# Check contract completeness
echo ""
echo "[3/8] Checking contract completeness..."
if grep -q "Inputs {" "$SKILL_MD" && grep -q "Outputs {" "$SKILL_MD" && grep -q "Constraints {" "$SKILL_MD"; then
    echo "✓ Contract has Inputs, Outputs, and Constraints"
else
    echo "✗ Contract missing required sections"
    exit 1
fi

# Check workflow steps
echo ""
echo "[4/8] Checking workflow steps..."
expected_steps=("explore_codebase" "assess_pillars" "identify_gaps" "implement_harness" "verify_harness")
for step in "${expected_steps[@]}"; do
    if grep -q "id: \"$step\"" "$SKILL_MD"; then
        echo "  ✓ $step"
    else
        echo "  ✗ $step MISSING"
        exit 1
    fi
done

# Check 8 pillars
echo ""
echo "[5/8] Checking 8 evaluation pillars..."
pillar_count=$(grep -c "| [0-9] | \*\*" "$SKILL_MD" || echo "0")
if [[ $pillar_count -ge 8 ]]; then
    echo "✓ $pillar_count pillars defined"
else
    echo "✗ Only $pillar_count pillars found (expected 8)"
    exit 1
fi

# Check maturity levels
echo ""
echo "[6/8] Checking 5 maturity levels..."
levels=("Bare" "Basic" "Enforced" "Automated" "Autonomous")
for level in "${levels[@]}"; do
    if grep -q "$level" "$SKILL_MD"; then
        echo "  ✓ $level"
    else
        echo "  ✗ $level MISSING"
        exit 1
    fi
done

# Check references
echo ""
echo "[7/8] Checking references..."
ref_count=$(grep -c "https://" "$SKILL_MD" || echo "0")
if [[ $ref_count -ge 5 ]]; then
    echo "✓ $ref_count reference URLs found"
else
    echo "✗ Only $ref_count references found (expected 5+)"
    exit 1
fi

# Check companion files
echo ""
echo "[8/8] Checking companion files..."
if [[ -d "$SKILL_DIR/tests" ]] && [[ -d "$SKILL_DIR/scripts" ]]; then
    test_count=$(ls "$SKILL_DIR/tests" 2>/dev/null | wc -l)
    script_count=$(ls "$SKILL_DIR/scripts" 2>/dev/null | wc -l)
    echo "✓ tests/ ($test_count files) and scripts/ ($script_count files) present"
else
    echo "⚠ Companion directories may be missing"
fi

echo ""
echo "=== Validation Complete ==="