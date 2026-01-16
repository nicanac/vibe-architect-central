---
name: create-subagents
description: Expert guidance for creating, building, and using Antigravity subagents and the Task tool. Use when working with subagents, setting up agent configurations, understanding how agents work, or using the Task tool to launch specialized agents.
---

## Objective

Subagents are specialized Antigravity instances that run in isolated contexts with focused roles and limited tool access. This skill teaches you how to create effective subagents, write strong system prompts, configure tool access, and orchestrate multi-agent workflows using the Task tool.

Subagents enable delegation of complex tasks to specialized agents that operate autonomously without user interaction, returning their final output to the main conversation.

## Quick Start

### Workflow

1. Run `/agents` command
2. Select "Create New Agent"
3. Choose project-level (`.agent/agents/`) or user-level (`~/.agent/agents/`)
4. Define the subagent:
   - **name**: lowercase-with-hyphens
   - **description**: When should this subagent be used?
   - **tools**: Optional comma-separated list (inherits all if omitted)
   - **model**: Optional (`sonnet`, `opus`, `haiku`, or `inherit`)
5. Write the system prompt (the subagent's instructions)

### Example

```markdown
---
name: code-reviewer
description: Expert code reviewer. Use proactively after code changes to review for quality, security, and best practices.
tools: Read, Grep, Glob, Bash
model: sonnet
---

## Role

You are a senior code reviewer focused on quality, security, and best practices.

## Focus Areas

- Code quality and maintainability
- Security vulnerabilities
- Performance issues
- Best practices adherence

## Output Format

Provide specific, actionable feedback with file:line references.
```

## File Structure

| Type        | Location               | Scope                | Priority |
| ----------- | ---------------------- | -------------------- | -------- |
| **Project** | `.agent/agents/`       | Current project only | Highest  |
| **User**    | `~/.agent/agents/`     | All projects         | Lower    |
| **Plugin**  | Plugin's `agents/` dir | All projects         | Lowest   |

Project-level subagents override user-level when names conflict.

## Configuration

### Field: name

- Lowercase letters and hyphens only
- Must be unique

### Field: description

- Natural language description of purpose
- Include when Antigravity should invoke this subagent
- Used for automatic subagent selection

### Field: tools

- Comma-separated list: `Read, Write, Edit, Bash, Grep`
- If omitted: inherits all tools from main thread
- Use `/agents` interface to see all available tools

### Field: model

- `sonnet`, `opus`, `haiku`, or `inherit`
- `inherit`: uses same model as main conversation
- If omitted: defaults to configured subagent model (usually sonnet)

## Execution Model

### Critical Constraint

**Subagents are black boxes that cannot interact with users.**

Subagents run in isolated contexts and return their final output to the main conversation. They:

- ✅ Can use tools like Read, Write, Edit, Bash, Grep, Glob
- ✅ Can access MCP servers and other non-interactive tools
- ❌ **Cannot use AskUserQuestion** or any tool requiring user interaction
- ❌ **Cannot present options or wait for user input**
- ❌ **User never sees subagent's intermediate steps**

The main conversation sees only the subagent's final report/output.

### Workflow Design

**Designing workflows with subagents:**

Use **main chat** for:

- Gathering requirements from user (AskUserQuestion)
- Presenting options or decisions to user
- Any task requiring user confirmation/input
- Work where user needs visibility into progress

Use **subagents** for:

- Research tasks (API documentation lookup, code analysis)
- Code generation based on pre-defined requirements
- Analysis and reporting (security review, test coverage)
- Context-heavy operations that don't need user interaction

**Example workflow pattern:**

```
Main Chat: Ask user for requirements (AskUserQuestion)
  ↓
Subagent: Research API and create documentation (no user interaction)
  ↓
Main Chat: Review research with user, confirm approach
  ↓
Subagent: Generate code based on confirmed plan
  ↓
Main Chat: Present results, handle testing/deployment
```

## System Prompt Guidelines

### Principle: Be Specific

Clearly define the subagent's role, capabilities, and constraints.

### Principle: Use Markdown Structure

Structure the system prompt with standard Markdown headers.

```markdown
---
name: security-reviewer
description: Reviews code for security vulnerabilities
tools: Read, Grep, Glob, Bash
model: sonnet
---

## Role

You are a senior code reviewer specializing in security.

## Focus Areas

- SQL injection vulnerabilities
- XSS attack vectors
- Authentication/authorization issues
- Sensitive data exposure

## Workflow

1. Read the modified files
2. Identify security risks
3. Provide specific remediation steps
4. Rate severity (Critical/High/Medium/Low)
```

### Principle: Task Specific

Tailor instructions to the specific task domain. Don't create generic "helper" subagents.

❌ Bad: "You are a helpful assistant that helps with code"
✅ Good: "You are a React component refactoring specialist. Analyze components for hooks best practices, performance anti-patterns, and accessibility issues."

## Subagent Markdown Structure

Subagent.md files are system prompts consumed only by Antigravity. Like skills and slash commands, they should use Markdown structure for optimal clarity.

### Recommended Headers

Common headers for subagent structure:

- `## Role` - Who the subagent is and what it does
- `## Constraints` - Hard rules (NEVER/MUST/ALWAYS)
- `## Focus Areas` - What to prioritize
- `## Workflow` - Step-by-step process
- `## Output Format` - How to structure deliverables
- `## Assessment` - Completion criteria
- `## Validation` - How to verify work

### Intelligence Rules

**Simple subagents** (single focused task):

- Use `## Role` and `## Constraints` and `## Workflow` minimum
- Example: code-reviewer, test-runner

**Medium subagents** (multi-step process):

- Add workflow steps, output_format, assessment
- Example: api-researcher, documentation-generator

**Complex subagents** (research + generation + validation):

- Add all sections as appropriate including validation, examples
- Example: mcp-api-researcher, comprehensive-auditor

## Invocation

### Automatic

Antigravity automatically selects subagents based on the `description` field when it matches the current task.

### Explicit

You can explicitly invoke a subagent:

```
> Use the code-reviewer subagent to check my recent changes
```

```
> Have the test-writer subagent create tests for the new API endpoints
```

## Background Execution

Subagents can run in the background using the `run_in_background` parameter, allowing parallel execution while the main conversation continues.

### How It Works

**Starting a background subagent:**
The Task tool accepts `run_in_background: true` to launch agents asynchronously:

```
Task tool call:
- description: "Analyze security vulnerabilities"
- prompt: "Review all authentication code for security issues..."
- subagent_type: "security-reviewer"
- run_in_background: true
```

The agent starts immediately and returns an `agent_id` for tracking.

### Retrieving Results

**Getting results with TaskOutput:**
Use the `TaskOutput` tool to retrieve results from background agents:

```
TaskOutput tool call:
- task_id: "agent-12345"  # The agent_id from the Task call
- block: true            # Wait for completion (default)
- timeout: 30000         # Max wait time in ms
```

**Parameters:**
| Parameter | Default | Description |
|-----------|---------|-------------|
| `task_id` | Required | The agent ID returned from Task tool |
| `block` | `true` | Wait for completion or check current status |
| `timeout` | `30000` | Max wait time in milliseconds (up to 600000) |

**Non-blocking check:**
Set `block: false` to check status without waiting:

```
TaskOutput tool call:
- task_id: "agent-12345"
- block: false
```

Returns current status: running, completed, or the final result.

### Parallel Agents

**Launching multiple agents in parallel:**

To maximize performance, launch multiple independent agents simultaneously:

```
Single message with multiple Task tool calls:

Task 1:
- description: "Review code quality"
- prompt: "Check code quality..."
- subagent_type: "code-reviewer"
- run_in_background: true

Task 2:
- description: "Run security scan"
- prompt: "Scan for vulnerabilities..."
- subagent_type: "security-scanner"
- run_in_background: true

Task 3:
- description: "Check test coverage"
- prompt: "Analyze test coverage..."
- subagent_type: "test-analyzer"
- run_in_background: true
```

Then retrieve all results:

```
TaskOutput calls for each agent_id
```

### When To Use Background

**Use background agents for:**

- Long-running analysis (security review, comprehensive code analysis)
- Multiple independent tasks that can run in parallel
- Tasks where you want to continue working while waiting
- Research tasks that may take significant time

**Don't use background for:**

- Quick operations (< 10 seconds)
- Tasks that depend on each other sequentially
- Tasks where immediate results are needed for next step
- Simple single-file operations

**Pattern: Parallel Analysis Pipeline**

```
1. Launch multiple analysis agents in background
2. Continue with other work or wait
3. Collect all results
4. Synthesize findings in main conversation
```

### Resuming Agents

**Resuming agents:**
Agents can be resumed using the `resume` parameter with their agent ID:

```
Task tool call:
- description: "Continue security review"
- prompt: "Please continue with the remaining files..."
- subagent_type: "security-reviewer"
- resume: "agent-12345"  # Previous agent ID
```

The agent continues with its full previous context preserved.

## Management

### Using Agents Command

Run `/agents` for an interactive interface to:

- View all available subagents
- Create new subagents
- Edit existing subagents
- Delete custom subagents

### Manual Editing

You can also edit subagent files directly:

- Project: `.agent/agents/subagent-name.md`
- User: `~/.agent/agents/subagent-name.md`

## Reference

**Core references**:

**Subagent usage and configuration**: [resources/subagents.md](resources/subagents.md)

- File format and configuration
- Model selection (Sonnet 4.5 + Haiku 4.5 orchestration)
- Tool security and least privilege
- Prompt caching optimization
- **Background execution** (run_in_background, TaskOutput, parallel agents)
- Complete examples

**Writing effective prompts**: [resources/writing-subagent-prompts.md](resources/writing-subagent-prompts.md)

- Core principles and Markdown structure
- Description field optimization for routing
- Extended thinking for complex reasoning
- Security constraints and strong modal verbs
- Assessment criteria definition

**Advanced topics**:

**Evaluation and testing**: [resources/evaluation-and-testing.md](resources/evaluation-and-testing.md)

- Evaluation metrics (task completion, tool correctness, robustness)
- Testing strategies (offline, simulation, online monitoring)
- Evaluation-driven development
- G-Eval for custom criteria

**Error handling and recovery**: [resources/error-handling-and-recovery.md](resources/error-handling-and-recovery.md)

- Common failure modes and causes
- Recovery strategies (graceful degradation, retry, circuit breakers)
- Structured communication and observability
- Anti-patterns to avoid

**Context management**: [resources/context-management.md](resources/context-management.md)

- Memory architecture (STM, LTM, working memory)
- Context strategies (summarization, sliding window, scratchpads)
- Managing long-running tasks
- Prompt caching interaction

**Orchestration patterns**: [resources/orchestration-patterns.md](resources/orchestration-patterns.md)

- Sequential, parallel, hierarchical, coordinator patterns
- Sonnet + Haiku orchestration for cost/performance
- Multi-agent coordination
- Pattern selection guidance

**Debugging and troubleshooting**: [resources/debugging-agents.md](resources/debugging-agents.md)

- Logging, tracing, and correlation IDs
- Common failure types (hallucinations, format errors, tool misuse)
- Diagnostic procedures
- Continuous monitoring

## Success Criteria

A well-configured subagent has:

- Valid YAML frontmatter (name matches file, description includes triggers)
- Clear role definition in system prompt
- Appropriate tool restrictions (least privilege)
- Markdown-structured system prompt with role, approach, and constraints
- Description field optimized for automatic routing
- Successfully tested on representative tasks
- Model selection appropriate for task complexity (Sonnet for reasoning, Haiku for simple tasks)
