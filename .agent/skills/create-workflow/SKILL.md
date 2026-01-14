---
name: create-workflow
description: Expert guidance for creating Antigravity Workflows. Use when creating new workflows, understanding workflow structure, or learning YAML configuration.
---

<objective>
Create effective Workflows for Antigravity that enable users to trigger reusable prompts with `/workflow-name` (or just slash command) syntax. Workflows are saved as Markdown files that expand as prompts in the current conversation, allowing teams to standardize processes.

Workflows can be **global** (available everywhere in `~/.agent/workflows/`) or **project-specific** (shared with team in `.agent/workflows/`). This skill teaches you to structure workflows with proper formatting, YAML frontmatter, dynamic context loading, and intelligent argument handling.

**CRITICAL WORKFLOW**: This skill enforces a mandatory research phase where you MUST:
1. Read all resource documentation
2. Examine existing workflows for patterns
3. Understand syntax and best practices
4. Only then create the workflow

This prevents poorly-structured workflows and ensures consistency with established patterns.
</objective>

<quick_start>

<workflow>
1. Create `.agent/workflows/` directory (project) or use `~/.agent/workflows/` (personal)
2. Create `workflow-name.md` file
3. Add YAML frontmatter (at minimum: `description`)
4. Write workflow prompt
5. Test with `/workflow-name [args]`
</workflow>

<example>
**File**: `.agent/workflows/optimize.md`

```markdown
---
description: Analyze this code for performance issues and suggest optimizations
---

Analyze the performance of this code and suggest three specific optimizations:
```

**Usage**: `/optimize` or `/optimize file.ts`

Antigravity receives the expanded prompt and analyzes the code in context.
</example>
</quick_start>

<xml_structure>
Workflows can use either XML tags OR Markdown headings in the body (after YAML frontmatter).

**Format choice depends on**:
- User preference (ask if not specified)
- Workflow complexity (XML better for complex, Markdown fine for simple)
- Existing project patterns (match what's already in use)

See [resources/prompt-examples.md](resources/prompt-examples.md) for real examples of both formats in production.

<required_tags>

**`<objective>`** - What the workflow does and why it matters

```markdown
<objective>
What needs to happen and why this matters.
Context about who uses this and what it accomplishes.
</objective>
```

**`<process>` or `<steps>`** - How to execute the workflow

```markdown
<process>
Sequential steps to accomplish the objective:
1. First step
2. Second step
3. Final step
</process>
```

**`<success_criteria>`** - How to know the workflow succeeded

```markdown
<success_criteria>
Clear, measurable criteria for successful completion.
</success_criteria>
```

</required_tags>

<conditional_tags>

**`<context>`** - When loading dynamic state or files

```markdown
<context>
Current state: ! `git status`
Relevant files: @ package.json
</context>
```

(Note: Remove the space after @ and ! in actual usage)

**`<verification>`** - When producing artifacts that need checking

```markdown
<verification>
Before completing, verify:
- Specific test or check to perform
- How to confirm it works
</verification>
```

**`<testing>`** - When running tests is part of the workflow

```markdown
<testing>
Run tests: ! `npm test`
Check linting: ! `npm run lint`
</testing>
```

**`<output>`** - When creating/modifying specific files

```markdown
<output>
Files created/modified:
- `./path/to/file.ext` - Description
</output>
```

</conditional_tags>

<structure_example>

```markdown
---
name: example-workflow
description: Does something useful
argument-hint: [input]
---

<objective>
Process #$ARGUMENTS to accomplish [goal].

This helps [who] achieve [outcome].
</objective>

<context>
Current state: ! `relevant command`
Files: @ relevant/files
</context>

<process>
1. Parse #$ARGUMENTS
2. Execute operation
3. Verify results
</process>

<success_criteria>

- Operation completed without errors
- Output matches expected format
  </success_criteria>
```

</structure_example>

<intelligence_rules>

**Simple workflows** (single operation, no artifacts):

- Required: `<objective>`, `<process>`, `<success_criteria>`
- Example: `/check-todos`, `/first-principles`

**Complex workflows** (multi-step, produces artifacts):

- Required: `<objective>`, `<process>`, `<success_criteria>`
- Add: `<context>` (if loading state), `<verification>` (if creating files), `<output>` (what gets created)
- Example: `/commit`, `/create-prompt`, `/run-prompt`

**Workflows with dynamic arguments**:

- Use `#$ARGUMENTS` in `<objective>` or `<process>` tags
- Include `argument-hint` in frontmatter
- Make it clear what the arguments are for

**Workflows that produce files**:

- Always include `<output>` tag specifying what gets created
- Always include `<verification>` tag with checks to perform

**Workflows that run tests/builds**:

- Include `<testing>` tag with specific commands
- Include pass/fail criteria in `<success_criteria>`
  </intelligence_rules>
  </xml_structure>

<arguments_intelligence>
The skill should intelligently determine whether a workflow needs arguments.

<workflows_that_need_arguments>

**User provides specific input:**

- `/fix-issue [issue-number]` - Needs issue number
- `/review-pr [pr-number]` - Needs PR number
- `/optimize [file-path]` - Needs file to optimize
- `/commit [type]` - Needs commit type (optional)

**Pattern:** Task operates on user-specified data

Include `argument-hint: [description]` in frontmatter and reference `#$ARGUMENTS` in the body.
</workflows_that_need_arguments>

<workflows_without_arguments>

**Self-contained procedures:**

- `/check-todos` - Operates on known file (TO-DOS.md)
- `/first-principles` - Operates on current conversation
- `/whats-next` - Analyzes current context

**Pattern:** Task operates on implicit context (current conversation, known files, project state)

Omit `argument-hint` and don't reference `#$ARGUMENTS`.
</workflows_without_arguments>

<incorporating_arguments>

**In `<objective>` tag:**

```markdown
<objective>
Fix issue #$ARGUMENTS following project conventions.

This ensures bugs are resolved systematically with proper testing.
</objective>
```

**In `<process>` tag:**

```markdown
<process>
1. Understand issue #$ARGUMENTS from issue tracker
2. Locate relevant code
3. Implement fix
4. Add tests
</process>
```

**In `<context>` tag:**

```markdown
<context>
Issue details: @ issues/#$ARGUMENTS.md
Related files: ! `grep -r "TODO.*#$ARGUMENTS" src/`
</context>
```

(Note: Remove the space after the exclamation mark in actual usage)
</incorporating_arguments>

<positional_arguments>

For structured input, use `$1`, `$2`, `$3`:

```markdown
---
argument-hint: <pr-number> <priority> <assignee>
---

<objective>
Review PR #$1 with priority $2 and assign to $3.
</objective>
```

**Usage**: `/review-pr 456 high alice`
</positional_arguments>
</arguments_intelligence>

<file_structure>

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
  </file_structure>

<yaml_frontmatter>

<field name="description">
**Required** - Describes what the workflow does

```yaml
description: Analyze this code for performance issues and suggest optimizations
```

Shown in the `/help` command list.
</field>

<field name="allowed-tools">
**Optional** - Restricts which tools Antigravity can use.
NOTE: Antigravity tool names may differ from Claude.

- `run_command` (Shell)
- `view_file` (Read)
- `replace_file_content` (Edit)
- `grep_search` (Grep)
- `list_dir` (Ls)

```yaml
allowed-tools: [run_command, view_file]
```
</field>
</yaml_frontmatter>

<arguments>
<all_arguments_string>

**Workflow file**: `.agent/workflows/fix-issue.md`

```markdown
---
description: Fix issue following coding standards
---

Fix issue #$ARGUMENTS following our coding standards
```

**Usage**: `/fix-issue 123 high-priority`

**Antigravity receives**: "Fix issue #123 high-priority following our coding standards"
</all_arguments_string>

<positional_arguments_syntax>

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
</positional_arguments_syntax>
</arguments>

<dynamic_context>

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
</dynamic_context>

<file_references>

Use `@` prefix to reference specific files:

```markdown
---
description: Review implementation
---

Review the implementation in @ src/utils/helpers.js
```

(Note: Remove the space after @ in actual usage)

Antigravity can access the referenced file's contents.
</file_references>

<best_practices>

**1. Always use XML structure**

```yaml
# All workflows should have XML-structured bodies
```

After frontmatter, use XML tags:

- `<objective>` - What and why (always)
- `<process>` - How to do it (always)
- `<success_criteria>` - Definition of done (always)
- Additional tags as needed (see xml_structure section)

**2. Clear descriptions**

```yaml
# Good
description: Analyze this code for performance issues and suggest optimizations

# Bad
description: Optimize stuff
```

**3. Use dynamic context for state-dependent tasks**

```markdown
Current git status: ! `git status`
Files changed: ! `git diff --name-only`
```

**4. Restrict tools when appropriate**

Use `allowed-tools` if you want to strictly limit capability (e.g. read-only analysis).

**5. Use #$ARGUMENTS for flexibility**

```markdown
Find and fix issue #$ARGUMENTS
```

**6. Reference relevant files**

```markdown
Review @ package.json for dependencies
Analyze @ src/database/\* for schema
```

(Note: Remove the space after @ in actual usage)
</best_practices>

<generation_protocol>

<step_0_mandatory_research>
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

**VERIFICATION CHECKLIST:**

Before proceeding to step 1, confirm you have:
- ✅ Read all resources
- ✅ Examined existing workflows
- ✅ Identified which pattern to use
- ✅ Understand the correct syntax
</step_0_mandatory_research>

<step_1_analyze_request>
**Analyze the user's request** to understand what they want:

- What is the workflow's purpose?
- Does it need user input (#$ARGUMENTS)?
- Does it produce files or artifacts?
- Does it require verification or testing?
- Is it simple (single-step) or complex (multi-step)?
</step_1_analyze_request>

<step_2_ask_questions_if_needed>
**INTELLIGENCE RULE**: Only ask questions if critical information is truly missing.

If the request is clear, skip directly to scope and format questions. Most requests like "create a workflow to X" contain enough information to proceed.

**Ask clarifying questions** ONLY if essential information is missing using `notify_user`.
</step_2_ask_questions_if_needed>

<step_2b_ask_scope>
**ALWAYS ask about scope** unless explicitly specified in the request:

Use `notify_user`:

- question: "Where should this workflow be available?"
- options:
  - "Global (all projects)" - description: "Saved to ~/.agent/workflows/ - available everywhere"
  - "Project only" - description: "Saved to .agent/workflows/ - shared with team via git"

**Detection rules**:

- If request says "global workflow" → Skip, use global scope
- If request says "project workflow" or "team workflow" → Skip, use project scope
- Otherwise → ALWAYS ask

**Important**: This determines the save location:

- Global: `~/.agent/workflows/workflow-name.md`
- Project: `.agent/workflows/workflow-name.md` (in current working directory)
</step_2b_ask_scope>

<step_3_choose_format>
**Determine format based on existing patterns:**

**Recommendation**:
- Match existing workflows format for consistency
- XML for complex multi-step workflows
- Markdown for simple straightforward workflows
</step_3_choose_format>

<step_4_create_frontmatter>
**Create YAML frontmatter** based on gathered information:

```yaml
---
name: workflow-name
description: Clear description of what it does
argument-hint: [input] # Only if arguments needed
allowed-tools: [...] # Only if tool restrictions needed
---
```
</step_4_create_frontmatter>
</generation_protocol>
