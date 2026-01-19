---
description: Test agent behavior with mock inputs/outputs and automated scenarios.
---

# Test Agent Workflow

This workflow guides you through testing your AI agents to ensure reliability and correctness.

## 1. Unit Testing Prompts
Create a test file `tests/agents/[agent-name].test.ts`.
- Use a prompt testing library or simple assertions.
- Mock the LLM response if testing tool logic only.
- Test against the prompt inputs defined in `prompt-engineering` workflow.

## 2. Mocking Tools
If your agent uses tools (e.g., database, web search), mock the tool outputs to test agent reasoning.
- **Scenario**: "Database returns 0 results" -> Agent should handle gracefully.
- **Scenario**: "Tool fails" -> Agent should retry or report error.

## 3. Integration Testing
Run the agent against a real (sandbox) environment.
- Use `run_command` or specific agent runner scripts.
- Verify the side effects (e.g., file created, DB row inserted).

## 4. Evaluation (Evals)
Define success metrics:
- **Accuracy**: Did it answer correctly?
- **Format**: Is the JSON valid?
- **Safety**: Did it refuse harmful requests?

## 5. Automated CI
Add a GitHub Action workflow to run these tests on every commit.
