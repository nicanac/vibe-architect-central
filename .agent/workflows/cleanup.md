---
description: Analyze code changes and apply refactoring patterns
argument-hint: [file-path] or [component-name]
---

## Objective

Analyze code for refactoring opportunities, specifically looking for:

1.  **Duplication**: Logic that can be merged.
2.  **Complexity**: Functions that need splitting.
3.  **Patterns**: Opportunities to use established project patterns.
4.  **Modernization**: Upgrading to latest tech stack features.

Target: Refactor @#$ARGUMENTS (or current changes if empty).

## Process

1. **Analyze Context**:

   - Check `git diff` to see recent changes.
   - Read target files using `view_file`.
   - Identify tech stack (React, Next.js, etc.).

2. **Plan Refactor**:

   - Propose specific changes to reduce complexity or duplication.
   - Validate against project patterns (e.g., "Intent-First", "Cyber-Industrial").

3. **Execute**:

   - Apply changes using `replace_file_content` or `multi_replace_file_content`.
   - Ensure no functionality is broken.

4. **Verify**:
   - Run build/tests if applicable.
   - Confirm code is cleaner and cleaner.

## Success Criteria

- Code is cleaner and more maintainable
- No functional regressions
- Design patterns respected
