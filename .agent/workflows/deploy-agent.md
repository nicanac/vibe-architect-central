---
description: Deploy AI agents to production environments (Vercel, Railway, or Custom).
---

# Deploy Agent Workflow

This workflow covers the deployment of your AI agents to be accessible in a production environment.

## 1. Containerization (Optional)
If your agent runs as a standalone service (Python/Node):
- Create a `Dockerfile`.
- optimize image size (multi-stage build).

## 2. Serverless Deployment (Vercel/Next.js)
If your agent is integrated into a Next.js app (using AI SDK):
- Ensure `maxDuration` is set high enough (e.g., 60s+).
- Use `streamText` for better UX.
- Deploy with `vercel deploy --prod`.

## 3. Background Workers (Trigger.dev / Inngest)
For long-running agents:
- Move agent logic to a background job queue.
- Configure timeouts and retries.

## 4. Environment Variables
- Sync all `.env` keys to the production environment.
- Double-check API keys for LLM providers and Tools.

## 5. Monitoring
- Set up logging (Helicone, Langfuse) to track agent cost and performance.
- Configure alerts for failure rates.
