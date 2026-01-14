---
description: Expert guidance for creating Claude Code slash commands with YAML configuration and dynamic context loading.
---

Expert guidance for creating Claude Code slash commands with YAML configuration and dynamic context loading.

The `/create-slash-commands` skill helps you create effective slash commands for Claude Code that enable users to trigger reusable prompts with `/command-name` syntax.

## What are Slash Commands?

Slash commands expand as prompts in the current conversation, allowing teams to standardize workflows and operations. Commands can be:

*   **Global** - Available everywhere in `~/.claude/commands/`
*   **Project-specific** - Shared with team in `.claude/commands/`

## Quick Start

### Workflow

1.  Create `.claude/commands/` directory (project) or use `~/.claude/commands/` (personal)
2.  Create `command-name.md` file
3.  Add YAML frontmatter (at minimum: `description`)
4.  Write command prompt
5.  Test with `/command-name [args]`

### Example

**File**: `.claude/commands/optimize.md`

MARKDOWN

```
---
description: Analyze this code for performance issues and suggest optimizations
---

Analyze the performance of this code and suggest three specific optimizations:
```

**Usage**: `/optimize`

## XML Structure

All generated slash commands should use XML tags in the body for clarity.

### Required Tags

**`<objective>`** - What the command does and why it matters

XML

```
<objective>
What needs to happen and why this matters.
Context about who uses this and what it accomplishes.
</objective>
```

**`<process>` or `<steps>`** - How to execute the command

XML

```
<process>
Sequential steps to accomplish the objective:
1. First step
2. Second step
3. Final step
</process>
```

**`<success_criteria>`** - How to know the command succeeded

XML

```
<success_criteria>
Clear, measurable criteria for successful completion.
</success_criteria>
```

### Conditional Tags

**`<context>`** - When loading dynamic state or files

XML

```
<context>
Current state: !`git status`
Relevant files: @package.json
</context>
```

**`<verification>`** - When producing artifacts that need checking

XML

```
<verification>
Before completing, verify:
- Specific test or check to perform
- How to confirm it works
</verification>
```

**`<testing>`** - When running tests is part of the workflow

XML

```
<testing>
Run tests: !`npm test`
Check linting: !`npm run lint`
</testing>
```

**`<output>`** - When creating/modifying specific files

XML

```
<output>
Files created/modified:
- `./path/to/file.ext` - Description
</output>
```

## YAML Frontmatter Options

Field

Required

Description

`description`

Yes

Short description shown in `/help` command list

`allowed-tools`

No

Restrict which tools Claude can use

`argument-hint`

No

Show expected arguments in autocomplete

### Allowed Tools Syntax

Restrict tools for security or focused execution:

YAML

```
# Array format
allowed-tools: [Read, Edit, Write]

# Single tool
allowed-tools: SequentialThinking

# Bash with command restrictions
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
```

If omitted, all tools are available.

## Arguments

### When to Use Arguments

**Commands that NEED arguments:**

*   Task operates on user-specified data
*   Examples: `/fix-issue [number]`, `/review-pr [number]`, `/optimize [file-path]`

**Commands WITHOUT arguments:**

*   Self-contained procedures operating on implicit context
*   Examples: `/check-todos`, `/first-principles`, `/whats-next`

### Argument Syntax

Commands can accept user input in two ways:

### All Arguments String

Use `#$ARGUMENTS` to capture all arguments as a single string:

MARKDOWN

```
---
description: Fix issue following coding standards
argument-hint: [issue-number]
---

Fix issue #$ARGUMENTS following our coding standards
```

**Usage**: `/fix-issue 123 high-priority`

**Claude receives**: "Fix issue #123 high-priority following our coding standards"

### Positional Arguments

Use `$1`, `$2`, `$3` for structured input:

MARKDOWN

```
---
description: Review PR with priority and assignee
argument-hint: <pr-number> <priority> <assignee>
---

<objective>
Review PR #$1 with priority $2 and assign to $3.
</objective>
```

**Usage**: `/review-pr 456 high alice`

**Claude receives**: "Review PR #456 with priority high and assign to alice"

## Dynamic Context

Execute bash commands and reference files to provide fresh context:

### Shell Commands

Use `!` before backticks to execute commands:

MARKDOWN

```
<context>
Git status: !`git status --short`
Current branch: !`git branch --show-current`
Recent commits: !`git log --oneline -5`
</context>
```

### File References

Use `@` to reference specific files:

MARKDOWN

```
<context>
Package info: @package.json
Source files: @src/utils/*.js
</context>
```

Both shell commands and file references are resolved when the command runs.

## Common Patterns

### Simple Analysis Command

MARKDOWN

```
---
description: Review this code for security vulnerabilities
---

<objective>
Review code for security vulnerabilities and suggest fixes.
</objective>

<process>
1. Scan code for common vulnerabilities (XSS, SQL injection, etc.)
2. Identify specific issues with line numbers
3. Suggest remediation for each issue
</process>

<success_criteria>
- All major vulnerability types checked
- Specific issues identified with locations
- Actionable fixes provided
</success_criteria>
```

### Git Workflow with Context

MARKDOWN

```
---
description: Create a git commit
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
---

<objective>
Create a git commit for current changes following repository conventions.
</objective>

<context>
- Current status: !`git status`
- Changes: !`git diff HEAD`
- Recent commits: !`git log --oneline -5`
</context>

<process>
1. Review staged and unstaged changes
2. Stage relevant files
3. Write commit message following recent commit style
4. Create commit
</process>

<success_criteria>
- All relevant changes staged
- Commit message follows repository conventions
- Commit created successfully
</success_criteria>
```

### Parameterized Command

MARKDOWN

```
---
description: Optimize code performance
argument-hint: [file-path]
---

<objective>
Analyze performance of @#$ARGUMENTS and suggest specific optimizations.
</objective>

<process>
1. Review code in @#$ARGUMENTS for performance issues
2. Identify bottlenecks and inefficiencies
3. Suggest three specific optimizations with rationale
4. Estimate performance impact of each
</process>

<success_criteria>
- Performance issues clearly identified
- Three concrete optimizations suggested
- Implementation guidance provided
- Performance impact estimated
</success_criteria>
```

**Usage**: `/optimize src/utils/helpers.js`

## Best Practices

1.  **Always use XML structure** - Claude parses it better than markdown headings
2.  **Clear descriptions** - "Analyze this code for performance issues" not "Optimize stuff"
3.  **Use dynamic context for state-dependent tasks** - Load fresh git status, test results, etc.
4.  **Restrict tools when appropriate** - Use `allowed-tools` for security (git commands, analysis-only)
5.  **Use #$ARGUMENTS for flexibility** - Let users specify what to operate on
6.  **Reference relevant files** - Use `@package.json` or `@src/**/*.ts` for context
7.  **Keep commands focused** - One command, one clear purpose
8.  **Include success criteria** - Define what "done" means

[/create-prompt](/docs/claude-code-pro/create-prompt)[/create-meta-prompts](/docs/claude-code-pro/create-meta-prompts)
