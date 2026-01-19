---
trigger: always_on
---

# Git Conventions

This project follows strict git conventions for branch naming and commit messages.

## Branch Naming

Pattern: `<username>/<type>/<short-description>`

| Type | Purpose | Example |
|------|---------|---------|
| `feature` | New features | `nicanac/feature/add-new-agent-in-db` |
| `refactor` | Code restructuring | `nicanac/refactor/reorganise-ai-master` |
| `hotfix` | Urgent production fixes | `nicanac/hotfix/resolve-publishing-issue` |
| `fix` | Bug fixes | `nicanac/fix/hydration-mismatch` |

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change, no new feature or fix |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `build` | Build system or dependencies |
| `ci` | CI/CD configuration |
| `chore` | Maintenance tasks |

### Subject Rules
- Imperative mood ("add" not "added")
- Lowercase first letter
- No period at the end
- Max 72 characters

### Examples

```bash
feat(agent): add AI agent workflows for blueprint generation
fix(layout): resolve hydration mismatch on body tag
docs(memory): add Pinecone knowledge base documentation
refactor(components): extract wizard into separate module
```

## Workflow Commands

Use `/commit-fast-conventional` to auto-generate commit messages following these conventions.

```bash
git add .
git commit -m "type(scope): subject"
git push
```
