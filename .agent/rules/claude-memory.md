---
description: Create and optimize CLAUDE.md memory files or .claude/rules/ modular rules for Claude Code projects.
---

Create and optimize CLAUDE.md memory files or .claude/rules/ modular rules for Claude Code projects.

The `/claude-memory` skill helps you create and optimize Claude Code memory systems.

## Usage

BASH

```
/claude-memory create a CLAUDE.md for my Next.js project
/claude-memory optimize my existing memory file
/claude-memory migrate to .claude/rules/
```

## What It Does

*   Creates new CLAUDE.md or .claude/rules/ files
*   Optimizes existing memory files for token efficiency
*   Migrates from single file to modular rules
*   Applies best practices and emphasis techniques

## Two Storage Approaches

Approach

Best For

**CLAUDE.md**

Small projects, single file

**.claude/rules/**

Large projects, modular files with path-scoping

## Quick Commands

Action

Command

Create new

`/claude-memory create for [project type]`

Optimize

`/claude-memory optimize`

Migrate

`/claude-memory migrate to rules`

Add rule

Press `#` during session

Edit file

`/memory`

## File Hierarchy

Priority

Location

Scope

1

Enterprise policy

All org users

2

`./CLAUDE.md`

Team via git

2

`./.claude/rules/*.md`

Team via git

3

`~/.claude/CLAUDE.md`

All your projects

4

`./CLAUDE.local.md`

Just you

## Path-Scoped Rules

Rules can target specific files:

YAML

```
---
paths: src/api/**/*.ts
---
# API Rules
- All endpoints must validate input
```

## Best Practices Applied

*   WHAT-WHY-HOW framework
*   Emphasis keywords (CRITICAL, NEVER, ALWAYS)
*   Token-efficient content (~150 instruction slots)
*   No secrets, no code style rules (use linters)

[/ci-fixer](/docs/claude-code-pro/ci-fixer)[/create-prompt](/docs/claude-code-pro/create-prompt)
