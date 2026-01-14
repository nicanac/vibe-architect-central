---
description: Deep iterative research using progressive flow psychology with parallel agents, skeptical analysis, and multi-perspective synthesis.
---

Deep iterative research using progressive flow psychology with parallel agents, skeptical analysis, and multi-perspective synthesis.

The `/brainstorm` command helps you conduct deep, thorough research on any topic using progressive flow psychology (diverge-analyze-converge-execute).

## What is Brainstorm?

Brainstorm is a research methodology that mirrors natural creative psychology. Unlike simple searches, it:

*   **Searches, then re-searches, then challenges findings**
*   **Questions every assumption with skepticism**
*   **Explores from 5 different expert perspectives**
*   **Produces actionable recommendations with confidence levels**
*   **Battle-tested conclusions** through skeptical analysis

## Basic Usage

BASH

```
/brainstorm What is the best CLI framework for building dev tools?
```

## Flags

Flag

Name

Description

`-e`

`--economy`

Economy mode: use direct tool calls instead of subagents. Reduces cost and context usage.

`-f`

`--fast`

Fast mode: skip Phase 2 (challenge) and condense Phase 3 to 3 perspectives. Quicker results.

`--file`

Save session

Write research to `.claude/output/brainstorm/{topic-slug}-{date}.md`

## Examples

### Standard research

BASH

```
/brainstorm What is the best CLI framework for building dev tools?
```

### Economy mode (saves tokens)

BASH

```
/brainstorm -e Should I use Next.js or Remix for my project?
```

### Fast mode (quick results)

BASH

```
/brainstorm -f Best practices for API rate limiting
```

### Combined flags with file output

BASH

```
/brainstorm -e -f --file Microservices vs monolith tradeoffs
```

## The 4-Phase Workflow

Phase

Role

Goal

Key Actions

**1\. Expansive Exploration**

CURIOUS EXPLORER

Cast widest net - no filtering

Searches multiple sources, gathers diverse perspectives, collects raw data

**2\. Critical Challenge**

DEVIL'S ADVOCATE

Stress-test every finding

Questions assumptions, looks for counter-evidence, challenges popular opinions  
_Skipped in fast mode_

**3\. Multi-Lens Synthesis**

SYNTHESIZER

See from 5 perspectives (3 in fast mode)

Technical expert, business strategist, end user, skeptic, pragmatist views

**4\. Action Crystallization**

STRATEGIC ADVISOR

Clear recommendations

Confidence levels, trade-offs, contrarian view, concrete next steps

## Persona

The brainstorm agent operates as a rigorous researcher with these traits:

*   **Deeply skeptical** - Question everything, trust nothing at face value
*   **Intellectually honest** - Admit uncertainty, acknowledge weak points
*   **Multi-perspective** - See problems from every angle
*   **Relentlessly curious** - Every answer spawns new questions
*   **Strong opinions, loosely held** - Form views but update them with evidence

## When to Use Brainstorm

Use `/brainstorm` when you need:

*   **Technology decisions** - Choosing between frameworks, libraries, or approaches
*   **Architecture decisions** - Microservices vs monolith, database choices
*   **Best practices research** - Finding proven patterns for specific problems
*   **Strategic planning** - Evaluating options with multiple perspectives
*   **Decision validation** - Testing your assumptions before committing

## Output

The brainstorm produces battle-tested conclusions:

1.  **Key findings** from expansive exploration
2.  **Challenged assumptions** with counter-evidence (unless fast mode)
3.  **Multi-perspective analysis** from 5 viewpoints (3 in fast mode)
4.  **Recommendations** with confidence levels and trade-offs
5.  **Contrarian view** - the case against the recommendation
6.  **Actionable insights** - concrete next steps

When using `--file`, all output is saved to `.claude/output/brainstorm/{topic-slug}-{date}.md` for later reference.

[/apex](/docs/claude-code-pro/apex-skills)[/debug](/docs/claude-code-pro/debug)
