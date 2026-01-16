---
name: create-workflow
description: Expert guidance for creating Antigravity Workflows. Use when creating new workflows, understanding workflow structure, or learning YAML configuration.
---

## Objective

Create effective Workflows for Antigravity that enable users to trigger reusable prompts with `/workflow-name` (or just slash command) syntax. Workflows are saved as Markdown files that expand as prompts in the current conversation, allowing teams to standardize processes.

Workflows can be **global** (available everywhere in `~/.agent/workflows/`) or **project-specific** (shared with team in `.agent/workflows/`). This skill teaches you to structure workflows with proper formatting, YAML frontmatter, dynamic context loading, and intelligent argument handling.

**CRITICAL WORKFLOW**: This skill enforces a mandatory research phase where you MUST:

1. Read all resource documentation
2. Examine existing workflows for patterns
3. Understand syntax and best practices
4. Only then create the workflow

This prevents poorly-structured workflows and ensures consistency with established patterns.

## Quick Start

### Workflow

1. Create `.agent/workflows/` directory (project) or use `~/.agent/workflows/` (personal)
2. Create `workflow-name.md` file
3. Add YAML frontmatter (at minimum: `description`)
4. Write workflow prompt
5. Test with `/workflow-name [args]`

### Example

**File**: `.agent/workflows/optimize.md`

```markdown
---
description: Analyze this code for performance issues and suggest optimizations
---

Analyze the performance of this code and suggest three specific optimizations:
```

**Usage**: `/optimize` or `/optimize file.ts`

Antigravity receives the expanded prompt and analyzes the code in context.

## Markdown Structure

Workflows should use Standard Markdown headings in the body (after YAML frontmatter).

**Format choice**:
Antigravity workflows work best with clear Markdown headers.

### Required Structure

**`## Objective`** - What the workflow does and why it matters

```markdown
## Objective

What needs to happen and why this matters.
Context about who uses this and what it accomplishes.
```

**`## Process`** - How to execute the workflow

```markdown
## Process

1. First step
2. Second step
3. Final step
```

**`## Assessment`** - How to know the workflow succeeded

```markdown
## Assessment

- Clear, measurable criteria for successful completion.
```

### Conditional Sections

**`## Context`** - When loading dynamic state or files

```markdown
## Context

Current state: ! `git status`
Relevant files: @ package.json
```

**`## Verification`** - When producing artifacts that need checking

```markdown
## Verification

Before completing, verify:

- Specific test or check to perform
- How to confirm it works
```

### Automation Tags

**`// turbo`** - Auto-run a single command step
Place on the line immediately before a numbered step involving `run_command`.

```markdown
// turbo 3. Create directory
```

**`// turbo-all`** - Auto-run ALL command steps in the workflow
Place anywhere in the file (recommend top of body).

```markdown
// turbo-all

## Process

...
```

### Intelligence Rules

**Simple workflows** (single operation, no artifacts):

- Required: `## Objective`, `## Process`, `## Assessment`

**Complex workflows** (multi-step, produces artifacts):

- Be explicit in `## Process`
- Use `## Context` to load state

**Workflows with dynamic arguments**:

- Use `#$ARGUMENTS` in text
- Include `argument-hint` in frontmatter

## Arguments Intelligence

The skill should intelligently determine whether a workflow needs arguments.

### Workflows That Need Arguments

**User provides specific input:**

- `/fix-issue [issue-number]` - Needs issue number
- `/review-pr [pr-number]` - Needs PR number
- `/optimize [file-path]` - Needs file to optimize
- `/commit [type]` - Needs commit type (optional)

**Pattern:** Task operates on user-specified data
Include `argument-hint: [description]` in frontmatter and reference `#$ARGUMENTS` in the body.

### Workflows Without Arguments

**Self-contained procedures:**

- `/check-todos` - Operates on known file (TO-DOS.md)
- `/first-principles` - Operates on current conversation
- `/whats-next` - Analyzes current context

**Pattern:** Task operates on implicit context (current conversation, known files, project state)
Omit `argument-hint` and don't reference `#$ARGUMENTS`.

### Incorporating Arguments

**In `## Objective` section:**

```markdown
## Objective

Fix issue #$ARGUMENTS following project conventions.
```

**In `## Process` section:**

```markdown
## Process

1. Understand issue #$ARGUMENTS from issue tracker
2. Locate relevant code
3. Implement fix
4. Add tests
```

**In `## Context` section:**

```markdown
## Context

Issue details: @ issues/#$ARGUMENTS.md
Related files: ! `grep -r "TODO.*#$ARGUMENTS" src/`
```

### Positional Arguments

For structured input, use `$1`, `$2`, `$3`:

```markdown
---
argument-hint: <pr-number> <priority> <assignee>
---

## Objective

Review PR #$1 with priority $2 and assign to $3.
```

**Usage**: `/review-pr 456 high alice`

## File Structure

**Project workflows**: `.agent/workflows/` (in project root)

- Shared with team via version control
- Project-specific workflows
- Shows `(project)` in `/help` list
- Committed to git for team use

**Global workflows**: `~/.agent/workflows/` (user home directory)

- Available across all your projects
- Personal productivity workflows
- Shows `(user)` in `/help` list
- Not shared with team

**File naming**: `workflow-name.md` → invoked as `/workflow-name`

**Choosing between global and project**:

- Use **global** for: Personal workflows, general utilities, workflows you use everywhere
- Use **project** for: Team workflows, project-specific operations, shared conventions

## YAML Frontmatter

### Field: description

**Required** - Describes what the workflow does

```yaml
description: Analyze this code for performance issues and suggest optimizations
```

Shown in the `/help` command list.

### Field: allowed-tools

**Optional** - Restricts which tools Antigravity can use.
NOTE: Ensure tool names match Antigravity's available tools.

- `run_command` (Shell)
- `view_file` (Read)
- `replace_file_content` (Edit)
- `grep_search` (Grep)
- `list_dir` (Ls)

```yaml
allowed-tools: [run_command, view_file]
```

## Arguments Usage

### All Arguments String

Use `#$ARGUMENTS` to capture all arguments strings.

**Workflow file**: `.agent/workflows/fix-issue.md`

```markdown
---
description: Fix issue following coding standards
---

Fix issue #$ARGUMENTS following our coding standards
```

**Usage**: `/fix-issue 123 high-priority`
**Antigravity receives**: "Fix issue #123 high-priority following our coding standards"

### Positional Arguments Syntax

Use `$1`, `$2` for split arguments.

**Workflow file**: `.agent/workflows/review-pr.md`

```markdown
---
description: Review PR with priority and assignee
---

Review PR #$1 with priority $2 and assign to $3
```

**Usage**: `/review-pr 456 high alice`
**Antigravity receives**: "Review PR #456 with priority high and assign to alice"

See [resources/arguments.md](resources/arguments.md) for advanced patterns.

## Dynamic Context

Execute bash commands before the prompt using the exclamation mark prefix directly before backticks (no space between).

**Note:** Examples below show a space after the exclamation mark to prevent execution during skill loading. In actual workflows, remove the space.

Example:

```markdown
---
description: Create a git commit
---

## Context

- Current git status: ! `git status`
- Current git diff: ! `git diff HEAD`
- Current branch: ! `git branch --show-current`
- Recent commits: ! `git log --oneline -10`

## Your task

Based on the above changes, create a single git commit.
```

The bash commands execute and their output is included in the expanded prompt.

## File References

Use `@` prefix to reference specific files:

```markdown
---
description: Review implementation
---

Review the implementation in @ src/utils/helpers.js
```

(Note: Remove the space after @ in actual usage)

Antigravity can access the referenced file's contents.

## Best Practices

**1. Always use Markdown Headers**

```yaml
# Antigravity workflows use standard Markdown structure
```

After frontmatter, use headers:

- `## Objective` - What and why (always)
- `## Process` - How to do it (always)
- `## Assessment` - Definition of done (always)
- Additional sections as needed

**2. Clear descriptions**
Write descriptive summaries for the `/help` list.

**3. Use dynamic context for state-dependent tasks**
Load fresh status for git ops or tests.

**4. Restrict tools when appropriate**
Use `allowed-tools` if you want to strictly limit capability (e.g. read-only analysis).

**5. Use #$ARGUMENTS for flexibility**
Let users specify files or IDs at runtime.

**6. Reference relevant files**
Use `@filename` to load context automatically.

## Generation Protocol

### Step 0: Mandatory Research

**CRITICAL: Complete this research phase BEFORE proceeding to any other steps.**

You MUST read and understand these materials before creating any workflow:

**1. Read ALL resource files in order:**
Use the `view_file` tool to read these files:

- `resources/prompt-examples.md` - Real-world patterns and examples
- `resources/patterns.md` - Verified workflow patterns
- `resources/arguments.md` - Argument handling examples
- `resources/tool-restrictions.md` - Tool restriction patterns

**2. Examine existing workflows:**
Use `list_dir` to find existing workflows:

```bash
ls .agent/workflows/
```

Then `view_file` 2-3 relevant existing workflows.

**3. Identify the right pattern:**
Based on the user's request, match it to one of these patterns from prompt-examples.md:

- **Pattern 1**: Numbered workflow (git ops, CI) - for multi-step processes
- **Pattern 2**: Reference/docs (CLI wrappers) - for command documentation
- **Pattern 3**: Section-based analysis (research, investigation) - for analysis tasks
- **Subagent patterns**: For workflows that launch other tools

**4. Check for similar existing workflows:**
Before creating a new workflow, check if a similar one already exists.

### Step 1: Analyze Request

**Analyze the user's request** to understand what they want:

- What is the workflow's purpose?
- Does it need user input (#$ARGUMENTS)?
- Does it produce files or artifacts?
- Does it require verification or testing?
- Is it simple (single-step) or complex (multi-step)?

### Step 2: Ask Questions If Needed

**INTELLIGENCE RULE**: Only ask questions if critical information is truly missing.
If the request is clear, skip directly to scope and format questions.

### Step 2b: Ask Scope

**ALWAYS ask about scope** unless explicitly specified in the request:
Use `notify_user`:

- question: "Where should this workflow be available?"
- options:
  - "Global (all projects)" - description: "Saved to ~/.agent/workflows/"
  - "Project only" - description: "Saved to .agent/workflows/"

**Detection rules**:

- If request says "global workflow" → Skip, use global scope
- If request says "project workflow" or "team workflow" → Skip, use project scope
- Otherwise → ALWAYS ask

### Step 3: Choose Format

**Determine format based on existing patterns:**

**Recommendation**:

- Antigravity prefers standard Markdown headers (`## Objective`, `## Process`) for all workflows.

### Step 4: Create Frontmatter

**Create YAML frontmatter** based on gathered information:

```yaml
---
name: workflow-name
description: Clear description of what it does
argument-hint: [input] # Only if arguments needed
allowed-tools: [...] # Only if tool restrictions needed
---
```
