---
description: Sync tasks from Memory Bank to GitHub Issues
---

# Sync Tasks to GitHub

## Objective

Automate the process of syncing tasks from `memory-bank/TASKS.md` to GitHub Issues.
This ensures that the development plan is reflected in the project management tool.
It utilizes `scripts/sync-tasks-github.ts` and the `gh` CLI.

## Prerequisite

- GitHub CLI (`gh`) must be authenticated.
- `memory-bank/TASKS.md` must exist.

## Process

// turbo
1. Execute the sync script
```bash
npm run sync:github
```

## Assessment

- [ ] New issues are created on GitHub for pending tasks.
- [ ] No duplicate issues are created.
- [ ] Output confirms "Sync Complete".

