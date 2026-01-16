---
description: Update master and rebase current branch
---

// turbo-all

## Objective

Update local master from remote, then rebase current branch on top of it.

## Process

1. **Secure State**:

   - `git stash push -u -m "Auto-stash before rebase"`

2. **Update Master**:

   - `git checkout master`
   - `git pull origin master`

3. **Rebase**:

   - `git checkout -`
   - `git rebase master`

4. **Restore State**:
   - `git stash pop`

## Assessment

- Master is updated
- Current branch rebased
- Stashed changes restored
