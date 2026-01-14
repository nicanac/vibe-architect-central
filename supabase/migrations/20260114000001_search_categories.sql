-- Vibe Architect Central - Phase 5.2: Search & Full-Text
-- Migration: Add full-text search and categories

-- Add full-text search indexes
ALTER TABLE tools ADD COLUMN IF NOT EXISTS fts tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
  ) STORED;

ALTER TABLE prompts ADD COLUMN IF NOT EXISTS fts tsvector 
  GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(technique, ''))
  ) STORED;

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_tools_fts ON tools USING GIN (fts);
CREATE INDEX IF NOT EXISTS idx_prompts_fts ON prompts USING GIN (fts);

-- Categories/Tags table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool Categories junction table
CREATE TABLE IF NOT EXISTS tool_categories (
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (tool_id, category_id)
);

-- Prompt Categories junction table  
CREATE TABLE IF NOT EXISTS prompt_categories (
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, category_id)
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_categories ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Tool categories are viewable by everyone" ON tool_categories
  FOR SELECT USING (true);

CREATE POLICY "Prompt categories are viewable by everyone" ON prompt_categories
  FOR SELECT USING (true);

-- Seed some categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('AI Coding', 'ai-coding', 'AI-powered coding assistants and IDEs', '#8b5cf6'),
  ('No-Code Builders', 'no-code-builders', 'Visual app builders requiring no code', '#10b981'),
  ('Prompt Engineering', 'prompt-engineering', 'Tools and techniques for crafting prompts', '#f59e0b'),
  ('AI Agents', 'ai-agents', 'Autonomous AI agents and orchestration', '#ef4444'),
  ('Design & UI', 'design-ui', 'AI-powered design and UI generation', '#ec4899'),
  ('Productivity', 'productivity', 'AI tools for productivity and automation', '#06b6d4')
ON CONFLICT (slug) DO NOTHING;

-- Create search function for tools
CREATE OR REPLACE FUNCTION search_tools(search_query TEXT)
RETURNS SETOF tools AS $$
BEGIN
  IF search_query IS NULL OR search_query = '' THEN
    RETURN QUERY SELECT * FROM tools ORDER BY created_at DESC;
  ELSE
    RETURN QUERY 
      SELECT * FROM tools 
      WHERE fts @@ plainto_tsquery('english', search_query)
      ORDER BY ts_rank(fts, plainto_tsquery('english', search_query)) DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create search function for prompts
CREATE OR REPLACE FUNCTION search_prompts(search_query TEXT)
RETURNS SETOF prompts AS $$
BEGIN
  IF search_query IS NULL OR search_query = '' THEN
    RETURN QUERY SELECT * FROM prompts ORDER BY created_at DESC;
  ELSE
    RETURN QUERY 
      SELECT * FROM prompts 
      WHERE fts @@ plainto_tsquery('english', search_query)
      ORDER BY ts_rank(fts, plainto_tsquery('english', search_query)) DESC;
  END IF;
END;
$$ LANGUAGE plpgsql;
