---
description: Expert code review guidance covering security (OWASP), clean code (SOLID), and high-value feedback patterns.
---

Expert code review guidance covering security (OWASP), clean code (SOLID), and high-value feedback patterns.

The `/review-code` skill provides expert-level code review guidance focusing on high-impact issues.

## Review Priority

**Priority order**: Security > Correctness > Maintainability > Performance

### High-Value Feedback (36-43% implementation rate)

*   Bug fixes and logic errors
*   Security vulnerabilities
*   Readability/maintainability issues
*   Missing error handling

### Skip These (automate instead)

*   Formatting/whitespace
*   Simple naming conventions
*   Linting violations

## Essential Checks

1.  **Security**: Input validation, auth checks, secrets exposure
2.  **Logic**: Edge cases, error handling, null checks
3.  **Architecture**: Single responsibility, proper abstractions
4.  **Tests**: Coverage for new functionality

## Review Categories

### Security (Critical)

Must check in every review:

*   No hardcoded credentials
*   Input validation on all user data
*   Parameterized queries (no SQL string concatenation)
*   Authorization checks on every endpoint
*   No `eval()`, `exec()`, dangerous functions

### Logic (Critical)

Verify correctness:

*   Business logic matches requirements
*   Edge cases handled (null, empty, boundary values)
*   Error handling present and appropriate
*   Race conditions in async code
*   Resource cleanup (connections, file handles)

### Clean Code (High)

Check for code smells:

*   Large functions (>50 lines) - violate Single Responsibility
*   Deep nesting (>3 levels) - extract to functions
*   Long parameter lists (>3 params) - use objects
*   Duplicated code - extract to shared functions
*   Magic numbers/strings - use named constants

### Maintainability (Medium)

Assess long-term health:

*   Cognitive complexity less than 15 per function
*   Clear naming that reveals intent
*   Appropriate abstractions (not over-engineered)
*   Test coverage for critical paths

## Feedback Structure

**What + Why + How**

Bad: "This is wrong"

Good: "This SQL query concatenates user input (line 42), which creates an injection vulnerability. Use parameterized queries instead: `db.query('SELECT * FROM users WHERE id = ?', [userId])`"

## Anti-Patterns to Avoid

1.  **Nitpicking** - Focus on impact, not style
2.  **Vague feedback** - Be specific and actionable
3.  **No rationale** - Always explain why
4.  **Missing alternatives** - Suggest solutions

[/clean-code](/docs/claude-code-pro/clean-code)[/ci-fixer](/docs/claude-code-pro/ci-fixer)
