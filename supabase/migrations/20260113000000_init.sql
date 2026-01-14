-- Vibe Architect Central - Database Schema
-- Run this in your Supabase SQL Editor

-- Create vibe_level enum type
CREATE TYPE vibe_level AS ENUM ('no-code', 'low-code', 'agentic', 'pro-orchestration');

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  vibe_level vibe_level NOT NULL DEFAULT 'agentic',
  pricing TEXT NOT NULL DEFAULT 'Free',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompts Table
CREATE TABLE IF NOT EXISTS prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_ai TEXT NOT NULL DEFAULT 'Claude 3.5',
  technique TEXT NOT NULL DEFAULT 'Chain of Thought',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for tools (public read, authenticated write)
CREATE POLICY "Tools are viewable by everyone" ON tools
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert tools" ON tools
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- RLS Policies for prompts (public read, authenticated write)
CREATE POLICY "Prompts are viewable by everyone" ON prompts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert prompts" ON prompts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own prompts" ON prompts
  FOR UPDATE USING (auth.uid() = created_by);

-- Seed Data: Sample Tools
INSERT INTO tools (name, description, url, vibe_level, pricing) VALUES
  ('Cursor', 'AI-first code editor with multi-file context and codebase understanding', 'https://cursor.sh', 'agentic', 'Free / $20/mo'),
  ('Bolt.new', 'Full-stack web apps from prompts with instant deployment', 'https://bolt.new', 'no-code', 'Free / Usage-based'),
  ('v0.dev', 'AI-powered UI component generator by Vercel', 'https://v0.dev', 'low-code', 'Free / $20/mo'),
  ('Claude', 'Anthropic''s advanced AI assistant with 200K context window', 'https://claude.ai', 'pro-orchestration', 'Free / $20/mo'),
  ('Replit Agent', 'Autonomous coding agent that builds and deploys apps', 'https://replit.com', 'agentic', '$25/mo');

-- Seed Data: Sample Prompts
INSERT INTO prompts (title, content, target_ai, technique) VALUES
  ('Chain of Thought Reasoning', 'Let''s approach this step-by-step:
1. First, identify the core problem
2. Break down into smaller sub-problems
3. Solve each sub-problem systematically
4. Synthesize the solutions
5. Verify the final answer', 'Claude 3.5', 'Chain of Thought'),
  ('Senior Architect Persona', 'You are a Senior Software Architect with 15+ years of experience. You prioritize:
- Clean, maintainable code over clever solutions
- Scalability and performance from day one
- Security best practices
- Clear documentation and knowledge transfer

When reviewing code, provide actionable feedback with examples.', 'GPT-4', 'Persona'),
  ('ReAct Pattern', 'Use the ReAct pattern for this task:

Thought: [Your reasoning about what to do next]
Action: [The specific action to take]
Observation: [What you learned from the action]

Repeat until task is complete.', 'Gemini Pro', 'ReAct');

-- Create indexes for performance
CREATE INDEX idx_tools_vibe_level ON tools(vibe_level);
CREATE INDEX idx_prompts_technique ON prompts(technique);
CREATE INDEX idx_prompts_target_ai ON prompts(target_ai);
