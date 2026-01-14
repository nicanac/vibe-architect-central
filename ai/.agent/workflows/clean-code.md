---
description: Comprehensive clean code workflow that analyzes codebase, recommends best practices, and applies clean code principles for React, Next.js, and modern tooling.
---

Comprehensive clean code workflow that analyzes codebase, recommends best practices, and applies clean code principles for React, Next.js, and modern tooling.

The `/clean-code` command helps you systematically improve code quality by analyzing your codebase, loading relevant best practices, and applying changes using parallel agents.

## Basic Usage

BASH

```
/clean-code auth feature
```

## Flags

Flag

Description

`-a`

Auto mode: skip confirmations

`-e`

Economy mode: no subagents, direct tools only

`-s`

Save mode: output to `.claude/output/clean-code/`

`-r`

Resume mode: continue from previous task

`--react`

Force load React 19 patterns

`--nextjs`

Force load Next.js 15/16 patterns

`--zustand`

Force load Zustand v5 patterns

`--query`

Force load TanStack Query v5 patterns

## Examples

BASH

```
# Basic
/clean-code auth feature

# Auto mode
/clean-code -a dashboard

# Economy + auto
/clean-code -e -a fix types

# Save outputs
/clean-code -s refactor api

# Resume
/clean-code -r auth-feature

# Force docs
/clean-code --nextjs --query data
```

## Workflow

The clean-code command follows a 3-step optimized flow:

Step

Purpose

Actions

**SCAN**

Init + analyze

Parse flags, detect tech stack, find issues using parallel agents

**APPLY**

Load docs + apply

Load relevant documentation, show recommendations, apply fixes

**VERIFY**

Build + commit

Run build, run tests, generate summary, offer commit option

**Note:** Economy mode (`-e`) skips subagents and uses direct tools only.

## Reference Files

The skill automatically loads relevant best practices based on detected technologies:

File

When Loaded

`general-clean-code.md`

Always

`react-clean-code.md`

React detected / `--react`

`nextjs-clean-code.md`

Next.js detected / `--nextjs`

`zustand-best-practices.md`

Zustand detected / `--zustand`

`tanstack-query-best-practices.md`

No data fetching / `--query`

## When to Use Clean-Code

Use `/clean-code` when you need to:

*   **Refactor a feature** - Improve code quality in a specific area
*   **Apply best practices** - Ensure code follows React/Next.js patterns
*   **Fix code smells** - Address maintainability issues
*   **Update patterns** - Modernize code to latest framework versions

[/debug](/docs/claude-code-pro/debug)[/review-code](/docs/claude-code-pro/review-code)
