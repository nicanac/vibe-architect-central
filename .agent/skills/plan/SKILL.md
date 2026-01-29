---
name: plan
description: Write comprehensive implementation plans with bite-sized TDD tasks. Use when you have a spec or requirements for a multi-step task, BEFORE touching code.
---

# Writing Implementation Plans

## Objective

Write comprehensive implementation plans assuming the engineer has zero context. Document everything: which files to touch, complete code, testing steps, verification commands.

**When to use:** After brainstorming/design is approved, before writing any code.

**Save plans to:** `docs/plans/YYYY-MM-DD-<feature-name>.md`

## Plan Document Structure

Every plan MUST start with this header:

```markdown
# [Feature Name] Implementation Plan

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

## Bite-Sized Task Granularity

**Each step is one action (2-5 minutes):**

| Step | Example |
|------|---------|
| Write test | "Write the failing test for user authentication" |
| Run test | "Run it to make sure it fails" |
| Implement | "Implement minimal code to make the test pass" |
| Verify | "Run tests and confirm they pass" |
| Commit | "Commit with message: feat(auth): add login" |

## Task Template

```markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.ts`
- Modify: `exact/path/to/existing.ts:123-145`
- Test: `tests/exact/path/to/test.ts`

**Step 1: Write the failing test**

\`\`\`typescript
describe('specific behavior', () => {
  it('should do expected thing', () => {
    const result = functionUnderTest(input);
    expect(result).toBe(expected);
  });
});
\`\`\`

**Step 2: Run test to verify it fails**

Run: `npm test -- tests/path/test.ts`
Expected: FAIL with "function not defined"

**Step 3: Write minimal implementation**

\`\`\`typescript
export function functionUnderTest(input: InputType): OutputType {
  return expected;
}
\`\`\`

**Step 4: Run test to verify it passes**

Run: `npm test -- tests/path/test.ts`
Expected: PASS

**Step 5: Commit**

\`\`\`bash
git add tests/path/test.ts src/path/file.ts
git commit -m "feat: add specific feature"
\`\`\`
```

## Key Principles

| Principle | Description |
|-----------|-------------|
| **Exact file paths** | Always include full paths, never "add it somewhere" |
| **Complete code** | Full code in plan, not "add validation here" |
| **Exact commands** | Include expected output for verification |
| **TDD workflow** | RED → GREEN → REFACTOR → COMMIT |
| **DRY** | Don't repeat yourself |
| **YAGNI** | You ain't gonna need it |

## The Process

### Phase 1: Analyze Requirements

1. **Review the design document** from brainstorming phase
2. **Identify all components** needed
3. **Order by dependencies** - What must exist first?
4. **Estimate task count** - Each component = 1-3 tasks

### Phase 2: Write Tasks

For each component:

1. **Define files** - Create, modify, test files with exact paths
2. **Write test first** - Complete test code, not pseudocode
3. **Write implementation** - Complete code, not placeholders
4. **Add verification** - Exact commands with expected output
5. **Add commit step** - Conventional commit message

### Phase 3: Review and Save

1. **Review plan** for completeness
2. **Save to** `docs/plans/YYYY-MM-DD-<feature>.md`
3. **Commit plan** to git

### Phase 4: Execution Handoff

After saving the plan, offer execution options:

> "Plan complete and saved. Two execution options:
> 
> 1. **Execute now** - I'll work through tasks one by one
> 2. **Later** - You can run `/execute-plan` when ready
> 
> Which approach?"

## Success Criteria

- Every task is 2-5 minutes of work
- Complete code included (no placeholders)
- Exact file paths for all changes
- TDD workflow enforced (test → implement → verify → commit)
- Plan saved and committed to git
