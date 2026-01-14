---
name: apex
description: Systematic implementation using APEX methodology (Analyze-Plan-Execute-eXamine) with parallel agents, self-validation, and optional adversarial review.
---

# /apex

Systematic implementation using APEX methodology (Analyze-Plan-Execute-eXamine) with parallel agents, self-validation, and optional adversarial review.

The `/apex` command is a powerful skill that helps you implement features systematically using the APEX methodology.

## Usage

BASH

```
/apex [-a] [-x] [-s] [-t] [-b] [-pr] [-i] [-r <task-id>] <task description>
```

## What is APEX?

APEX stands for **A**nalyze, **P**lan, **E**xecute, e**X**amine. It's a structured approach to implementing features that ensures:

*   **Thorough context gathering** before writing code
*   **Clear implementation plans** with file-by-file strategies
*   **Systematic execution** with progress tracking
*   **Self-validation** to catch issues early
*   **Optional adversarial review** for critical code

## Basic Usage

BASH

```
/apex add user authentication
```

This will start the APEX workflow for adding user authentication to your project.

## Flags

### Enable Flags (turn ON)

Short

Long

Description

`-a`

`--auto`

Autonomous mode: skip confirmations, auto-approve plans

`-x`

`--examine`

Auto-examine mode: proceed to adversarial review

`-s`

`--save`

Save mode: output each step to `.claude/output/apex/`

`-t`

`--test`

Test mode: include test creation and runner steps

`-e`

`--economy`

Economy mode: no subagents, save tokens (for limited plans)

`-r`

`--resume`

Resume mode: continue from a previous task

`-b`

`--branch`

Branch mode: verify not on main, create branch if needed

`-pr`

`--pull-request`

PR mode: create pull request at end (enables -b)

`-i`

`--interactive`

Interactive mode: configure flags via AskUserQuestion

### Disable Flags (turn OFF)

Short

Long

Description

`-A`

`--no-auto`

Disable auto mode

`-X`

`--no-examine`

Disable examine mode

`-S`

`--no-save`

Disable save mode

`-T`

`--no-test`

Disable test mode

`-E`

`--no-economy`

Disable economy mode

`-B`

`--no-branch`

Disable branch mode

`-PR`

`--no-pull-request`

Disable PR mode

## Examples

### Basic usage

BASH

```
/apex add auth middleware
```

### Autonomous mode (no confirmations)

BASH

```
/apex -a add auth middleware
```

### Save outputs for review

BASH

```
/apex -s add auth middleware
```

### With adversarial review

BASH

```
/apex -x add auth middleware
```

### Full autonomous with examine and save

BASH

```
/apex -a -x -s add auth middleware
```

### Include test creation and runner

BASH

```
/apex -t add auth middleware
```

### Resume a previous task

BASH

```
/apex -r 01-auth-middleware
/apex -r 01  # Partial match supported
```

### Economy mode (save tokens, no subagents)

BASH

```
/apex -e add auth middleware
/apex -a -e add auth middleware  # Auto + economy
```

### Branch mode (ensure not on main)

BASH

```
/apex -b add auth middleware
```

### Create PR at end

BASH

```
/apex -pr add auth middleware
/apex -a -pr add auth middleware  # Auto + PR mode
```

### Interactive mode (configure flags via menu)

BASH

```
/apex -i add auth middleware
```

## Workflow Steps

The APEX workflow uses progressive step loading for efficient context usage:

Step

Name

Purpose

00

Init

Parse flags, create output folder, initialize state

01

Analyze

Pure context gathering (what exists, not what to do)

02

Plan

File-by-file implementation strategy

03

Execute

Todo-driven implementation

04

Validate

Self-check and validation

05

Examine

Adversarial code review (optional, with `-x`)

06

Resolve

Finding resolution (optional, if issues found)

07

Tests

Test analysis and creation (with `-t`)

08

Run Tests

Test runner loop until green (with `-t`)

09

Finish

Create pull request (with `-pr`)

### Step Details

**Analyze**: The agent explores your codebase to understand existing patterns, conventions, related files, dependencies, and current architecture.

**Plan**: Creates a file-by-file implementation strategy including which files to create or modify, specific changes for each file, and order of implementation.

**Execute**: Todo-driven implementation phase where each change is tracked as a todo item with real-time progress visibility.

**Validate**: Self-check phase to verify changes compile, check for obvious issues, and run basic sanity checks.

**Examine** (optional): Adversarial code review with critical analysis of changes, security review, and performance considerations.

**Resolve** (optional): Fixes any issues found during examination phase.

**Tests** (optional): When `-t` flag is used, analyzes and creates appropriate tests, then runs them until all pass.

## Output Structure

When using `-s` (save mode), outputs are saved to `.claude/output/apex/{task-id}/`:

File

Description

`00-context.md`

Params, user request, timestamp

`01-analyze.md`

Analysis findings

`02-plan.md`

Implementation plan

`03-execute.md`

Execution log

`04-validate.md`

Validation results

`05-examine.md`

Review findings (if -x)

`06-resolve.md`

Resolution log (if -x)

`07-tests.md`

Test analysis and creation (if -t)

`08-run-tests.md`

Test runner log (if -t)

`09-finish.md`

Workflow finish and PR creation (if -pr)

## Resume Mode

You can resume a previous task using the `-r` flag:

BASH

```
/apex -r 01-add-auth-middleware
/apex -r 01  # Partial match supported
```

The agent will:

1.  Locate the task folder in `.claude/output/apex/`
2.  Read `00-context.md` to restore original task description, flags, and acceptance criteria
3.  Scan existing step files to determine the highest completed step
4.  Continue from the next step or current incomplete step

Partial matching is supported, so `/apex -r 01` will find `01-add-auth-middleware`. If multiple matches are found, you'll be asked to specify.

## Best Practices

1.  **Use save mode for complex tasks** - It helps you review the analysis and plan before execution
2.  **Use examine mode for critical code** - Security-sensitive or complex business logic benefits from adversarial review
3.  **Use economy mode when token-limited** - Still effective but uses fewer resources
4.  **Resume interrupted tasks** - Don't start over, use `-r` to continue

[Cheatsheet](/docs/claude-code-pro/cheatsheet)[/brainstorm](/docs/claude-code-pro/brainstorm)
