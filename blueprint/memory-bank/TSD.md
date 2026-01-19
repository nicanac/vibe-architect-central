# MeetFlow AI - Technical Specification

## Validated Stack (Expo SDK 54+)

| Layer | Technology | Version / Note |
|-------|------------|----------------|
| **Mobile** | React Native + Expo | SDK 54 (Context7 Verified) |
| **Router** | Expo Router | File-based routing (Tabs + Stack) |
| **Language** | TypeScript | 5.x Strict |
| **Audio** | @siteed/expo-audio-stream | Real-time recording & analysis |
| **Backend** | Supabase | Auth, Postgres, Realtime |
| **State** | Zustand | Global client state |
| **Charts** | react-native-chart-kit | Sentiment visualization |

## Database Schema (Proposed)

```sql
-- Profiles managed by Supabase Auth
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  avatar_url text
);

-- Meetings
create table public.meetings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles not null,
  title text not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  duration_seconds int,
  audio_url text, -- Supabase Storage path
  sentiment_score float
);

-- Transcripts (Real-time)
create table public.transcripts (
  id uuid default gen_random_uuid() primary key,
  meeting_id uuid references public.meetings on delete cascade not null,
  speaker_label text,
  content text not null,
  timestamp_ms int,
  created_at timestamptz default now()
);

-- Action Items
create table public.action_items (
  id uuid default gen_random_uuid() primary key,
  meeting_id uuid references public.meetings on delete cascade not null,
  description text not null,
  assignee_name text,
  priority text check (priority in ('low', 'medium', 'high')),
  is_completed boolean default false
);
```
