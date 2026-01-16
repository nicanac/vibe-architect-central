---
description: Stash changes, update main, and create new branch
---

// turbo-all

## Objective

Phase 1: Secure current work.
Phase 2: Update base branch (master).
Phase 3: Create new branch using project script.
Phase 4: Apply stashed work to new branch.

Target: Create branch of type '$1' with description '$2'.

## Process

1. **Secure State**:

   - `git stash push -u -m "Auto-stash before branch creation"`

2. **Update Base**:

   - `git checkout master`
   - `git pull origin master`

3. **Create Branch**: be sure to use this script to create the branch

   - Run: `node scripts/create-branch.js --type "$1" --desc "$2" --yes`

4. **Restore State**:
   - `git stash pop` (only if stash was created)

## Success Criteria

- Clean switch to new branch
- Master updated before branching
- User work preserved and restored
- Script conventions followed
