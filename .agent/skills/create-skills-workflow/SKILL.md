---
name: create-skills-workflow
description: Create multi-step workflow skills with progressive step loading, state management, and interactive decisions.
---

# /create-skills-workflow

Create multi-step workflow skills with progressive step loading, state management, and interactive decisions.

The `/create-skills-workflow` skill guides the creation of professional multi-step workflow skills like APEX.

**Usage:** `/create-skills-workflow <workflow name> [description]`

## What are Workflow Skills?

Workflow skills use:

*   **Progressive step loading** to minimize context usage
*   **State persistence** across steps via frontmatter
*   **Interactive decision points** with AskUserQuestion
*   **Optional/conditional steps** for flexibility

## When to Use

**Use this skill when building:**

*   Multi-phase workflows (3+ distinct steps)
*   Skills that need state persistence across steps
*   Interactive workflows with user decision points
*   Skills with optional/conditional steps
*   Workflows that save outputs for review

**Don't use for:**

*   Simple single-action skills
*   Skills that complete in one step
*   Pure research/exploration skills

## Quick Start

1.  Define your steps and their dependencies
2.  Create the folder structure
3.  Copy and customize SKILL.md template
4.  Create step-00-init.md for initialization
5.  Create each step using the step template
6.  Test the workflow end-to-end

## Workflow Creation Process

### Phase 1: Design the Workflow

**1.1 Identify Workflow Steps**

*   What are the distinct phases of this workflow?
*   What must complete before the next step can start?
*   Which steps are optional or conditional?
*   Where do users need to make decisions?

**1.2 Map Dependencies**

```
Step 1 ──► Step 2 ──► Step 3 ──┬──► Step 4a (if condition)
                               └──► Step 4b (else)
```

**1.3 Define State Variables**

YAML

```
state_variables:
  - task_description: string   # What to do
  - task_id: string            # Unique identifier
  - auto_mode: boolean         # Skip confirmations
  - results: object            # Accumulated results
```

### Phase 2: Create Structure

**Folder Structure**

Path

Purpose

`SKILL.md`

Main entry point with state variables

`steps/step-00-init.md`

Initialization (parse flags, setup)

`steps/step-01-{name}.md`

First step

`steps/step-02-{name}.md`

Second step

`references/`

Optional: templates, patterns

**Naming Conventions**

*   Steps: `step-NN-{descriptive-name}.md`
*   NN = two-digit number (00, 01, 02...)
*   Use kebab-case for names
*   Keep names short but descriptive

## Critical Patterns (BMAD-Inspired)

### 1\. Micro-File Architecture

*   ✅ ALWAYS: Each step is a self-contained file
*   ✅ ALWAYS: Load one step at a time (progressive loading)
*   ❌ NEVER: Load all steps upfront
*   ❌ NEVER: Assume knowledge from future steps

### 2\. Every Step Must Have

Section

Purpose

**MANDATORY EXECUTION RULES**

Critical boundaries with 🛑✅📋💬🚫 emojis

**EXECUTION PROTOCOLS**

How to execute this step

**CONTEXT BOUNDARIES**

What's in scope, what's not

**YOUR TASK**

One clear sentence describing purpose

**EXECUTION SEQUENCE**

Numbered list of actions

**SUCCESS METRICS**

✅ What success looks like

**FAILURE MODES**

❌ What to avoid

**NEXT STEP**

Where to go next

### 3\. User Decisions with AskUserQuestion

**CRITICAL:** Never use plain text prompts like "\[C\] Continue". Always use AskUserQuestion tool.

YAML

```
questions:
  - header: "Continue"
    question: "Ready to proceed to the next step?"
    options:
      - label: "Continue (Recommended)"
        description: "Proceed to next phase"
      - label: "Review first"
        description: "I want to review before continuing"
    multiSelect: false
```

**Auto Mode:** Check `auto_mode` before ANY AskUserQuestion call to skip user interaction.

### 4\. Frontmatter State Tracking

Track progress in document frontmatter:

YAML

```
---
stepsCompleted: [1, 2, 3]
task_description: "Add auth middleware"
selected_approach: "jwt"
---
```

### 5\. Critical Tags

Use `<critical>` tags for essential reminders:

MARKDOWN

```
<critical>
Remember: This step is ONLY about analysis - don't plan or implement!
</critical>
```

## Common Mistakes to Avoid

Mistake

Solution

Loading all steps at once

Use micro-file architecture, one step at a time

Plain text prompts "\[C\] Continue"

ALWAYS use AskUserQuestion tool

Missing MANDATORY EXECUTION RULES

Every step MUST start with rules using emojis

No CONTEXT BOUNDARIES section

Always define what's in scope and what's not

Vague YOUR TASK statement

Must be ONE clear sentence

Forgetting state handoff

Document available variables from previous steps

Missing SUCCESS METRICS

Every step needs ✅ success criteria and ❌ failure modes

Not handling auto\_mode

Check auto\_mode before ANY AskUserQuestion call

No frontmatter state tracking

Track `stepsCompleted` array in document

Hardcoding paths

Use relative paths and state variables

## Success Criteria

**A well-designed workflow skill has:**

**Structure:**

*   Micro-file architecture - each step self-contained
*   Clear step progression with dependencies
*   State variables documented and persisted in frontmatter

**Each Step Has:**

*   MANDATORY EXECUTION RULES section with emojis
*   EXECUTION PROTOCOLS section
*   CONTEXT BOUNDARIES section
*   YOUR TASK - one clear sentence
*   Numbered EXECUTION SEQUENCE
*   SUCCESS METRICS with ✅ checkmarks
*   FAILURE MODES with ❌ marks
*   NEXT STEP routing section
*   `<critical>` reminder at the end

**User Interaction:**

*   ALL user decisions use AskUserQuestion (never plain text)
*   Auto mode skips AskUserQuestion calls
*   Save mode outputs to files with frontmatter

**State Management:**

*   `stepsCompleted` array tracked in frontmatter
*   Resume detection checks existing documents
*   State variables passed between steps

## Templates

The skill includes reference templates:

*   Step Template - Base structure for any step
*   Ask Patterns - AskUserQuestion patterns
*   State Management - Persisting data across steps
*   Workflow Patterns - Common workflow designs
*   Prompt Engineering - Best practices for prompts

[/create-meta-prompts](/docs/claude-code-pro/create-meta-prompts)[/create-agent](/docs/claude-code-pro/create-agent-skills)
