# Project Setup Guide

## 1. Prerequisites
- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Supabase CLI (`npm install -g supabase`)
- Expo Go App (iOS/Android) or Simulator

## 2. Installation
```bash
# Install dependencies
npm install

# Setup local credentials
cp .env.example .env
```

## 3. Environment Variables (.env)
```
EXPO_PUBLIC_SUPABASE_URL=your_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## 4. Run Development Server
```bash
npx expo start
```
- Press `a` for Android
- Press `i` for iOS
- Scan QR code with Expo Go

## 5. Deployment
- **Frontend**: EAS Build (`eas build`)
- **Backend/DB**: Supabase (`supabase db push`)
