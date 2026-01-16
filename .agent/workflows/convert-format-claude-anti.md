---
description: Convert AI instruction files between Claude (XML) and Antigravity (Markdown) formats.
argument-hint: <file_path> [direction: 'to-antigravity' | 'to-claude']
---

## Objective

Convert the specified AI instruction file (workflow, skill, or agent rule) between the **Antigravity** standard (Markdown headers) and the **Legacy/Claude** standard (XML tags).

## Context

Target File: @#$ARGUMENTS

## Process

1.  **Analyze the file content** at `#$ARGUMENTS`:

    - **Detect Format**:
      - If it contains `<objective>`, `<process>`, or XML-style wrappers -> It is **Legacy/Claude Format**.
      - If it uses `## Objective`, `## Process`, and standard Markdown -> It is **Antigravity Format**.

2.  **Determine Conversion Direction**:

    - If argument says `to-antigravity` OR file is Legacy -> **Convert to Antigravity**.
    - If argument says `to-claude` OR file is Antigravity -> **Convert to Claude**.

3.  **Execute Conversion**:

    ### Case A: Convert to Antigravity (Markdown)

    - **Structure**: Replace top-level XML tags with Markdown Level 2 headers.
      - `<objective>` -> `## Objective`
      - `<process>` -> `## Process`
      - `<success_criteria>` -> `## Assessment`
      - `<context>` -> `## Context`
      - Remove closing tags like `</objective>`, `</process>`.
    - **Generic Fallback**:
      - Converts any other XML tag `<custom_tag>` to Title Case Header `## Custom Tag`.
      - Example: `<visual_analysis_protocol>` becomes `## Visual Analysis Protocol`.
    - **Terminology**:
      - Replace "Claude" with "Antigravity" (case-insensitive where appropriate).
      - Replace "XML tags" references with "Markdown headers".
    - **Cleanliness**: Ensure proper spacing (one blank line before headers).

    ### Case B: Convert to Claude (XML)

    - **Structure**: Replace Markdown Level 2 headers with XML tags.
      - `## Objective` -> `<objective>` ... `</objective>`
      - `## Process` -> `<process>` ... `</process>`
      - `## Assessment` -> `<success_criteria>` ... `</success_criteria>`
      - `## Context` -> `<context>` ... `</context>`
    - **Generic Fallback**:
      - Converts any other Level 2 Header `## Custom Title` to snake_case XML tag `<custom_title>`.
      - Example: `## Visual Analysis Protocol` becomes `<visual_analysis_protocol>`.
    - **Terminology**:
      - Replace "Antigravity" with "Claude".
      - Replace "Markdown headers" references with "XML tags".

4.  **Save Changes**:
    - Use `replace_file_content` (or `write_to_file` if rewriting whole file is safer) to apply the transformed content.

## Assessment

1.  File structure matches the target format (Headers for Antigravity, Tags for Claude).
2.  Terminology is consistent with the target ecosystem.
3.  No mixed formats (e.g., XML tags lingering in a Markdown file).
