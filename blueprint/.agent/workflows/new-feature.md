---
description: Automate the process of adding a new feature
---

## Objective

Implement a new feature following the "Intent-First" methodology.

1.  **Track**: Add to `./memory-bank/TASKS.md`.
2.  **Refine**: Gather requirements from user.
3.  **Analyze**: Understand existing code.
4.  **Implement**: Build and verify.

Target: Implement feature "$1" @#$ARGUMENTS.

## Process

1. **Task Tracking**:

   - Read `./mermory-bank/TASKS.md`.
   - Add "Phase X: Feature - $1" to `TASKS.md` using `multi_replace_file_content`.

2. **Requirement Gathering**:

   - Ask the user: "What are the specific requirements for '$1'? Any UI/UX preferences or API needs?" (using `notify_user` or implicit prompt).
   - _Self-Correction_: Since workflows run autonomously, we assume the user provided context in the prompt or we pause for input.
   - Use `brainstorm` or `plan_mode` if complex.

3. **Analysis**:

   - Run `explore-codebase` to find relevant files.
   - identifying integration points.

4. **Implementation & Verification**:
   - Create/Update files.
   - Update `TASKS.md` status.

## Success Criteria

- Task added to TASKS.md
- Feature implemented
- Tests/Verification passed
