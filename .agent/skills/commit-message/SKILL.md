---
name: skill-commit-message
description: Generate conventional commit messages by analyzing repository changes following conventionalcommits.org specification
---

# Commit Message Generator Skill

Generate conventional commit messages by analyzing repository changes.

## Usage

Ask Copilot to:
- "Generate a commit message"
- "Create a commit for my changes"
- "What should my commit message be?"
- "Commit"

## Features

- Analyzes staged and unstaged changes
- Follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification
- Suggests appropriate type (feat, fix, docs, etc.)
- Identifies scope from affected files
- Provides ready-to-use git commands

## Commit Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, whitespace |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding/fixing tests |
| `build` | Build system/dependencies |
| `ci` | CI configuration |
| `chore` | Maintenance tasks |
| `revert` | Revert previous commit |

## Format

```
<type>(<scope>): <short description>

<optional body>

<optional footer>
```
