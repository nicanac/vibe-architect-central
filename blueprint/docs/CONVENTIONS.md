# Coding Conventions

## Git Commits
Follow Conventional Commits:
- `feat: add recording button`
- `fix: crash on ios start`
- `style: linting`
- `docs: update setup guide`

**Tip**: Use the `/commit-fast-conventional` workflow!

## Naming
- **Files**: `kebab-case.tsx` (e.g., `meeting-card.tsx`)
- **Components**: `PascalCase` (e.g., `MeetingCard`)
- **Functions**: `camelCase` (e.g., `recordAudio`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_DURATION`)

## Project Structure
- `app/`: Expo Router screens ONLY.
- `components/`: Reusable UI only.
- `lib/`: Business logic, API calls, hooks.
- `store/`: Zustand stores.

## Styling
- Use `StyleSheet` for now.
- If upgrading to `NativeWind`, follow Tailwind utility patterns.
- Colors: Use `constants/Colors.ts` (or hardcoded purple theme for blueprint).
