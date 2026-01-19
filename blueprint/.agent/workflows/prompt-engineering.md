---
description: Iterative workflow for designing, testing, and optimizing system prompts.
---

# Prompt Engineering Workflow

Use this workflow to refine agent behavior through systematic prompt iteration.

## 1. Draft (v1)
Create a new prompt file `prompts/drafts/[feature]-v1.md`.
- **Goal**: Define the objective clearly.
- **Context**: Add necessary background info.
- **Instructions**: Step-by-step logic.

## 2. Test Cases
Define 3 distinct test inputs:
1. **Simple**: The happy path.
2. **Complex**: Edge cases or ambiguity.
3. **Adversarial**: Instructions that might trick the model.

## 3. Evaluation Loop
Run the prompt against the test cases.
- **Pass**: Model output matches expectation.
- **Fail**: Model hallucinates, ignores constraints, or is lazy.

## 4. Refine (Optimization)
Techniques to fix failures:
- **Few-Shot**: Add examples of Input -> Desired Output.
- **Chain of Thought**: Ask model to "Think step by step".
- **Negative Constraints**: Explicitly state what NOT to do.

## 5. Finalize
1. Move finalized prompt to `prompts/production/`.
2. Version control it (git).
3. Update `MEMORY.md` if this is a core system prompt.
