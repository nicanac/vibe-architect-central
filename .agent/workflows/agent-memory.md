---
description: Configure Pinecone vector storage and RAG patterns for agent memory.
---

# Agent Memory (RAG) Workflow

This workflow sets up the long-term memory for your agent using Pinecone and embeddings.

## 1. Index Creation
1. Define the index name (e.g., `agent-memory`).
2. Choose dimensions (matches embedding model, e.g., 1536 for text-embedding-3-small).
3. Create index via Pinecone Console or script.

## 2. Embedding Pipeline
Create a utility function to embed text:
- **Input**: Text chunk.
- **Output**: Vector array.

## 3. Upsert Logic (Memory Storage)
When the agent needs to remember something:
1. Create a "Memory" record.
2. Metadata: `timestamp`, `agent_id`, `context_type` (e.g., 'user_preference', 'fact').
3. Upsert to Pinecone.

## 4. Retrieval Tool (Recall)
Give the agent a tool: `search_memory(query: string)`.
- **Logic**: Embed query -> Query Pinecone -> Return top K text snippets.
- **Context Injection**: Prepend retrieved memories to the System Prompt.

## 5. Maintenance
- Periodically clean up old memories or summarize them (Instruction-based consolidation).
