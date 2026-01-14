-- ============================================
-- Instructions Table Migration
-- Agent Instructions Hub for Vibe Architect Central
-- ============================================

-- Create enum types for instructions
CREATE TYPE instruction_category AS ENUM (
  'command',    -- Slash commands (/commit, /review)
  'agent',      -- Specialized AI personas
  'skill',      -- Multi-step workflows (SKILL.md)
  'hook',       -- Event-driven automation
  'rule',       -- Project-wide instructions (.cursorrules, CLAUDE.md)
  'prompt'      -- System prompts & persona definitions
);

CREATE TYPE instruction_agent_type AS ENUM (
  'copilot',      -- GitHub Copilot
  'claude',       -- Claude (Anthropic)
  'claude-code',  -- Claude Code CLI
  'chatgpt',      -- ChatGPT (OpenAI)
  'gemini',       -- Gemini (Google)
  'cursor',       -- Cursor IDE
  'windsurf',     -- Windsurf IDE
  'other'         -- Other AI tools
);

CREATE TYPE instruction_difficulty AS ENUM (
  'beginner',
  'intermediate', 
  'advanced'
);

CREATE TYPE instruction_file_format AS ENUM (
  'markdown',
  'json',
  'yaml',
  'toml',
  'text'
);

-- Create instructions table
CREATE TABLE IF NOT EXISTS instructions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic info
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  content TEXT NOT NULL,  -- The actual instruction content (markdown/code)
  
  -- Categorization
  category instruction_category NOT NULL,
  agent_types instruction_agent_type[] NOT NULL DEFAULT ARRAY['other']::instruction_agent_type[],
  difficulty instruction_difficulty NOT NULL DEFAULT 'intermediate',
  file_format instruction_file_format NOT NULL DEFAULT 'markdown',
  
  -- Metadata
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  usage_example TEXT,  -- How to use it
  source_url TEXT,     -- Original source URL (for migrated content)
  
  -- Ownership
  submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  copy_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Full-text search (updated via trigger)
  search_vector TSVECTOR
);

-- Create indexes
CREATE INDEX idx_instructions_category ON instructions(category);
CREATE INDEX idx_instructions_agent_types ON instructions USING GIN(agent_types);
CREATE INDEX idx_instructions_difficulty ON instructions(difficulty);
CREATE INDEX idx_instructions_tags ON instructions USING GIN(tags);
CREATE INDEX idx_instructions_search ON instructions USING GIN(search_vector);
CREATE INDEX idx_instructions_slug ON instructions(slug);
CREATE INDEX idx_instructions_created_at ON instructions(created_at DESC);
CREATE INDEX idx_instructions_view_count ON instructions(view_count DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_instructions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_instructions_updated_at
  BEFORE UPDATE ON instructions
  FOR EACH ROW
  EXECUTE FUNCTION update_instructions_updated_at();

-- Create search_vector trigger function
CREATE OR REPLACE FUNCTION update_instructions_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.content, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_instructions_search_vector
  BEFORE INSERT OR UPDATE ON instructions
  FOR EACH ROW
  EXECUTE FUNCTION update_instructions_search_vector();

-- ============================================
-- Row Level Security (RLS)
-- ============================================

ALTER TABLE instructions ENABLE ROW LEVEL SECURITY;

-- Anyone can read instructions
CREATE POLICY "Anyone can view instructions"
  ON instructions FOR SELECT
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can create instructions"
  ON instructions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = submitted_by);

-- Users can update their own instructions
CREATE POLICY "Users can update own instructions"
  ON instructions FOR UPDATE
  TO authenticated
  USING (auth.uid() = submitted_by)
  WITH CHECK (auth.uid() = submitted_by);

-- Users can delete their own instructions
CREATE POLICY "Users can delete own instructions"
  ON instructions FOR DELETE
  TO authenticated
  USING (auth.uid() = submitted_by);

-- ============================================
-- Helper Functions
-- ============================================

-- Search instructions function
CREATE OR REPLACE FUNCTION search_instructions(search_query TEXT)
RETURNS SETOF instructions AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM instructions
  WHERE search_vector @@ plainto_tsquery('english', search_query)
  ORDER BY ts_rank(search_vector, plainto_tsquery('english', search_query)) DESC;
END;
$$ LANGUAGE plpgsql;

-- Increment view count function
CREATE OR REPLACE FUNCTION increment_instruction_view(instruction_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE instructions
  SET view_count = view_count + 1
  WHERE id = instruction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment copy count function
CREATE OR REPLACE FUNCTION increment_instruction_copy(instruction_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE instructions
  SET copy_count = copy_count + 1
  WHERE id = instruction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Favorites for Instructions
-- ============================================

-- Add instruction favorites to existing favorites table or create junction
CREATE TABLE IF NOT EXISTS instruction_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  instruction_id UUID REFERENCES instructions(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, instruction_id)
);

ALTER TABLE instruction_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own instruction favorites"
  ON instruction_favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add instruction favorites"
  ON instruction_favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove instruction favorites"
  ON instruction_favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
