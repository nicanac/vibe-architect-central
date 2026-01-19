# MeetFlow AI - Architecture

## Mobile Architecture (Expo Router)

The app follows a strict verified Expo Router structure:

```
app/
├── _layout.tsx          # ROOT Stack (Required by Expo SDK 54)
├── (tabs)/              # Tab Navigator Group
│   ├── _layout.tsx      # Tab Configuration
│   ├── index.tsx        # Dashboard (Home)
│   ├── notes.tsx        # Meeting Notes
│   ├── tasks.tsx        # Action Items
│   └── settings.tsx     # Settings
└── meeting/
    └── [id].tsx         # Dynamic Meeting Details
```

## Data Flow
1. **Recording**: `@siteed/expo-audio-stream` captures audio buffer.
2. **Transcription**: Audio chunk -> Edge Function -> Whisper API -> Text.
3. **Sync**: Text -> Supabase `transcripts` table -> Realtime subscription -> UI.
4. **Storage**: Full audio file uploading to Supabase Storage bucket `recordings`.

## UI/UX Design System
- **Theme**: `design-inspiration/design-analysis.json`
- **Components**: Reusable, atomic components in `components/`
- **Styling**: `StyleSheet` or `NativeWind` (Tailwind)
