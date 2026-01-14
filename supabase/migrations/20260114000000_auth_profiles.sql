-- Vibe Architect Central - Phase 5.1: Auth & User Features
-- Migration: profiles table and favorites

-- Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  vibe_level vibe_level DEFAULT 'low-code',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favorites Table (many-to-many for tools)
CREATE TABLE IF NOT EXISTS favorite_tools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Favorites Table (many-to-many for prompts)
CREATE TABLE IF NOT EXISTS favorite_prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_prompts ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Favorite Tools Policies
CREATE POLICY "Users can view own favorite tools" ON favorite_tools
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorite tools" ON favorite_tools
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorite tools" ON favorite_tools
  FOR DELETE USING (auth.uid() = user_id);

-- Favorite Prompts Policies
CREATE POLICY "Users can view own favorite prompts" ON favorite_prompts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorite prompts" ON favorite_prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorite prompts" ON favorite_prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update prompts to link to profiles for created_by display
-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_favorite_tools_user ON favorite_tools(user_id);
CREATE INDEX IF NOT EXISTS idx_favorite_prompts_user ON favorite_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_display_name ON profiles(display_name);

-- Update tools RLS to allow only authenticated inserts
DROP POLICY IF EXISTS "Authenticated users can insert tools" ON tools;
CREATE POLICY "Authenticated users can insert tools" ON tools
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Update prompts RLS for better ownership
DROP POLICY IF EXISTS "Authenticated users can insert prompts" ON prompts;
CREATE POLICY "Authenticated users can insert prompts" ON prompts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
