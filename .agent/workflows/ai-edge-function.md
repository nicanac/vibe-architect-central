---
description: Create Supabase Edge Function for AI tasks (Whisper, OpenAI, LangChain).
---

# AI Edge Function Workflow

This workflow sets up a serverless Edge Function on Supabase to handle AI operations securely.

## 1. Scaffold Function
Run the supabase CLI command:
```bash
supabase functions new [function-name]
```
*Suggestion: Use names like `ai-chat`, `audio-transcribe`, `vector-search`.*

## 2. Configure Environment
1. Store API keys in Supabase secrets:
   ```bash
   supabase secrets set OPENAI_API_KEY=sk-...
   ```
2. In `deno.json`, add necessary imports (LangChain, OpenAI SDK, etc.).

## 3. Implement Logic
Edit `supabase/functions/[function-name]/index.ts`.
- **CORS**: Handle OPTIONS requests.
- **Auth**: Verify Authorization header (JWT).
- **AI Call**: Call the AI provider (OpenAI, Anthropic).
- **Stream**: Return a streaming response if building a chat interface.

## 4. Local Testing
Run locally:
```bash
supabase functions serve [function-name] --no-verify-jwt
```
Test with `curl` or Postman.

## 5. Deployment
Deploy to production:
```bash
supabase functions deploy [function-name]
```
