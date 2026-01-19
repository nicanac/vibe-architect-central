#!/bin/bash

# Initialize MeetFlow AI Project from Blueprint

echo "🚀 Initializing MeetFlow AI..."

# 1. Copy Blueprint to Root (if running from scratch)
# In a real scenario, you'd run this script to hydrate a new repo.
# For now, we assume we are in the project root or setting it up.

# 2. Install Dependencies
echo "📦 Installing Dependencies..."
echo "  - expo"
echo "  - expo-router"
echo "  - @supabase/supabase-js"
echo "  - @siteed/expo-audio-stream"
echo "  - zustand"

# npm install expo expo-router react react-dom react-native react-native-web @expo/vector-icons @supabase/supabase-js @siteed/expo-audio-stream zustand react-native-chart-kit react-native-svg

# 3. Setup Supabase
echo "🗄️ Setting up Supabase..."
# npx supabase init
# npx supabase login

# 4. Agent Setup
echo "🤖 Configuring AI Agents..."
# cp -r .agent/workflows .
# cp .agent/rules/architecture.md .cursorrules

echo "✅ Project Initialized! Run 'npx expo start' to begin."
