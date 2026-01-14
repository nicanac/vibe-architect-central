---
name: commit-message
description: Generate conventional commit messages by analyzing repository changes following conventionalcommits.org specification
---

# Commit Message Generator Skill

Generate conventional commit messages by analyzing repository changes following the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

## When to use this skill

- Use this when you need to generate a commit message for staged or unstaged changes.
- This is helpful for ensuring commit messages are standardized, descriptive, and follow best practices.
- Triggered by user requests like:
  - "Generate a commit message"
  - "Create a commit for my changes"
  - "What should my commit message be?"
  - "Commit"

## How to use it

1.  **Analyze Changes**: Examine staged (`git diff --cached`) and unstaged (`git diff`) changes to understand the context.
2.  **Determine Commit Type**: Select the appropriate type from the table below:

    | Type | Description |
    |------|-------------|
    | `feat` | New feature |
    | `fix` | Bug fix |
    | `docs` | Documentation only changes |
    | `style` | Formatting, whitespace changes |
    | `refactor` | Code restructuring without behavior change |
    | `perf` | Performance improvement |
    | `test` | Adding or correcting tests |
    | `build` | Build system or dependency changes |
    | `ci` | CI configuration changes |
    | `chore` | Maintenance tasks |
    | `revert` | Revert previous commit |

3.  **Identify Scope**: (Optional) Specify the affected codebase area (e.g., `auth`, `api`, `ui`).
4.  **Draft Message**:
    - Subject: Imperative mood, lowercase, no period (e.g., `feat(auth): add login`).
    - Body: (Optional) Explain "what" and "why".
    - Footer: (Optional) Breaking changes or issue references.

5.  **Output Format**: Present the message in a code block, followed by the git command.

    ```
    <type>(<scope>): <short description>

    <optional body>

    <optional footer>
    ```

    **Git Source:**
    ```bash
    git add . && git commit -m "<type>(<scope>): <description>" -m "<body>"
    ```
