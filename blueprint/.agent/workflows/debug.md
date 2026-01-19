---
description: Systematic error debugging with analysis, solution discovery, and multi-layer verification.
---

Systematic error debugging with analysis, solution discovery, and multi-layer verification.

The `/debug` command helps you systematically debug errors through a structured 5-step workflow.

## What is Debug?

Debug is a battle-tested methodology for fixing errors that goes beyond simple fixes:

*   **Reproduce before fixing** - If you can't reproduce it, you can't verify the fix
*   **Hypothesis-driven analysis** - List 3-5 causes ranked by likelihood
*   **Multi-layer verification** - Tests alone give false confidence

## Basic Usage

BASH

```
/debug [error description or context] [-a for auto mode]
```

Example:

BASH

```
/debug The login form throws an error when submitting
```

## Flags

Flag

Name

Description

`-a, --auto`

Auto mode

Full automatic mode - don't ask the user, use recommended solutions

## Examples

### Standard debugging

BASH

```
/debug The API returns 500 when creating a new user
```

### Auto mode (no confirmations)

BASH

```
/debug -a Build fails with TypeScript error in auth module
```

## The 5-Step Workflow

### Step 1: Analyze

Goal: Reproduce the error and form hypotheses.

*   Attempts to reproduce the error
*   Lists 3-5 potential causes ranked by likelihood
*   Identifies the root cause through systematic testing

### Step 2: Find Solutions

Goal: Research 2-3+ potential solutions.

*   Explores different approaches to fix the issue
*   Documents pros/cons for each solution
*   Considers edge cases and side effects

### Step 3: Propose

Goal: Present solutions for user selection.

*   Shows all discovered solutions
*   Recommends the best option
*   Waits for user confirmation (unless in auto mode)

### Step 4: Fix

Goal: Implement the chosen solution.

*   Makes the necessary code changes
*   Adds strategic logging for verification
*   Documents what was changed

### Step 5: Verify

Goal: Multi-layer verification to ensure the fix works.

Uses the Verification Pyramid:

Layer

Type

What It Checks

4

Manual

User confirms the fix works

3

Runtime Execution

**CRITICAL**: Real execution of the code path

2

Automated Checks

Build, Types, Lint, Tests

1

Static Analysis

Syntax, Imports

## Core Principles

### 1\. Reproduce Before Anything Else

If you can't reproduce the error, you can't verify the fix. The debug workflow always starts by attempting to reproduce the exact issue.

### 2\. Hypothesis-Driven Analysis

Instead of random guessing, the workflow:

*   Lists 3-5 potential causes
*   Ranks them by likelihood
*   Tests systematically from most likely to least

### 3\. Multi-Layer Verification

**Key Insight**: Tests passing ≠ fix working.

Tests alone give false confidence (20-40% still fail in production). The workflow ALWAYS executes the actual code path, not just runs tests.

## When to Use Debug

Use `/debug` when you have:

*   **Runtime errors** - Exceptions, crashes, unexpected behavior
*   **Build failures** - TypeScript errors, compilation issues
*   **Test failures** - Tests that suddenly started failing
*   **Integration issues** - API errors, database problems
*   **Mysterious bugs** - Something isn't working and you don't know why

## Auto Mode vs Interactive

### Interactive Mode (default)

*   Presents multiple solution options
*   Waits for user to choose
*   Good for learning and understanding the fix

### Auto Mode (`-a`)

*   Automatically selects the recommended solution
*   No confirmations required
*   Good for quick fixes and CI/CD pipelines

BASH

```
/debug -a The tests are failing after the merge
```

## Output

The debug workflow produces:

1.  **Error reproduction** - Confirmed reproduction steps
2.  **Root cause analysis** - What's actually causing the issue
3.  **Solution options** - 2-3+ approaches with pros/cons
4.  **Implementation** - The actual code fix
5.  **Verification results** - Proof that the fix works

[/brainstorm](/docs/claude-code-pro/brainstorm)[/clean-code](/docs/claude-code-pro/clean-code)
