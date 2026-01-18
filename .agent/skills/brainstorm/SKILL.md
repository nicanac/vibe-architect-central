---
name: brainstorm
description: Socratic design refinement for turning ideas into fully formed designs and specs. Use BEFORE any creative work - creating features, building components, adding functionality, or modifying behavior.
---

# Brainstorming Ideas Into Designs

## Objective

Help turn rough ideas into fully formed designs and specs through natural collaborative dialogue.

This skill activates **before writing any code**. It refines ideas through questions, explores alternatives, and presents the design in sections for validation before saving a design document.

## The Process

### Phase 1: Understanding the Idea

1. **Check project context first** - Review relevant files, docs, recent commits
2. **Ask questions one at a time** - Never overwhelm with multiple questions
3. **Prefer multiple choice** - When possible, offer 2-3 options instead of open-ended questions
4. **Focus on understanding:**
   - What is the purpose?
   - What are the constraints?
   - What does success look like?

### Phase 2: Exploring Approaches

1. **Propose 2-3 different approaches** with trade-offs
2. **Lead with your recommendation** and explain why
3. **Present options conversationally** - not as a dry list
4. **Apply YAGNI ruthlessly** - Remove unnecessary features from all options

### Phase 3: Presenting the Design

1. **Break into sections of 200-300 words**
2. **Ask after each section:** "Does this look right so far?"
3. **Cover these topics:**
   - Architecture overview
   - Components and responsibilities
   - Data flow
   - Error handling
   - Testing strategy
4. **Be ready to backtrack** - If something doesn't make sense, clarify

### Phase 4: Documentation

1. **Write validated design** to `docs/plans/YYYY-MM-DD-<topic>-design.md`
2. **Commit the design document** to git
3. **Ask:** "Ready to create the implementation plan?"

## Key Principles

| Principle | Description |
|-----------|-------------|
| **One question at a time** | Don't overwhelm with multiple questions |
| **Multiple choice preferred** | Easier to answer than open-ended |
| **YAGNI ruthlessly** | Remove unnecessary features from all designs |
| **Explore alternatives** | Always propose 2-3 approaches before settling |
| **Incremental validation** | Present design in sections, validate each |
| **Be flexible** | Go back and clarify when needed |

## Example Questions

**Purpose clarification:**
> "What problem does this solve for users?"

**Multiple choice:**
> "For data storage, I see three options:
> 1. **Local state** - Simplest, but data lost on refresh
> 2. **Supabase** - Persistent, matches our stack
> 3. **External API** - If integrating with existing system
> 
> I'd recommend option 2 since we already have Supabase. Does that work?"

**Constraint discovery:**
> "Are there any performance requirements? For example, should this work offline?"

## Success Criteria

- User's idea is fully understood before design starts
- 2-3 approaches explored with clear trade-offs
- Design validated section by section
- Design document saved and committed
- User is ready to proceed to planning phase
