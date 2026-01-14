---
description: Quickly create conventional commit messages with automatic staging and push
---

# /commit Command

Execute a fast conventional commit workflow that reuses the logic from the `commit-message` skill.

1.  **Analyze Changes**: Examine staged (`git diff --cached`) and unstaged (`git diff`) changes to understand the context.
2.  **Generate Message**: Use the [commit-message skill](file:///c:/Users/bruye/.gemini/antigravity/scratch/vibe-architect-central/.agent/skills/commit-message/SKILL.md) to generate a conventional commit message.
    - **Type**: Determine the type (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert).
    - **Scope**: Identify the scope (optional).
    - **Subject**: Imperative mood, lowercase, no period.
    - **Body**: Explain "what" and "why" (optional).
    - **Footer**: Breaking changes or issue references (optional).
3.  **Execute Workflow**:
    - Stage all changes: `git add .`
    - Commit with the generated message: `git commit -m "<type>(<scope>): <subject>" -m "<body>"`
    - Push to remote: `git push`

## Usage

```bash
/commit
```

## Options

- Add context after the command to guide the message:
  ```bash
  /commit added user authentication
  ```

// turbo-all
