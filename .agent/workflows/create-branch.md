---
description: Stash changes, update main, and create new branch
argument-hint: <type> <description>
allowed-tools: run_command(git *), run_command(node scripts/create-branch.js *)
---

<objective>
Phase 1: Secure current work.
Phase 2: Update base branch (main).
Phase 3: Create new branch using project script.
Phase 4: Apply stashed work to new branch.

Target: Create branch of type '$1' with description '$2'.
</objective>

<process>
1. **Secure State**:
   - `git stash push -u -m "Auto-stash before branch creation"`

2. **Update Base**:
   - `git checkout main`
   - `git pull origin main`

3. **Create Branch**:
   - Run: `node scripts/create-branch.js --type "$1" --desc "$2" --yes`

4. **Restore State**:
   - `git stash pop` (only if stash was created)
</process>

<success_criteria>
- Clean switch to new branch
- Main updated before branching
- User work preserved and restored
- Script conventions followed
</success_criteria>
