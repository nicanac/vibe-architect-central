---
name: code-review-skill
description: Comprehensive code review following OWASP, SOLID, and best practices
---

# Code Review Skill

# Code Review Skill Instructions

## Purpose

Conduct comprehensive code reviews that improve code quality, catch bugs early, ensure security, and promote team learning.

## Review Checklist

### ✅ Correctness

- Does the code do what it's supposed to do?
- Are edge cases handled properly?
- Is the logic correct and complete?

### 🔒 Security

- Input validation and sanitization
- No hardcoded secrets or credentials
- Proper authentication and authorization

### 🏗️ Architecture

- Follows SOLID principles
- Appropriate separation of concerns
- Consistent with existing patterns

### 📖 Readability

- Clear, descriptive naming
- Functions are small and focused
- Complex logic is documented

## Feedback Format

| Prefix        | Meaning                  |
| ------------- | ------------------------ |
| 🚨 BLOCKER    | Critical issue, must fix |
| ⚠️ WARNING    | Should fix               |
| 💡 SUGGESTION | Nice to have             |
| 👍 PRAISE     | Great work!              |
