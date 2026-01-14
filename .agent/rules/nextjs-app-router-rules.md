---
description: Project-wide coding standards for Next.js 14+ App Router projects
---

# Next.js App Router Project Rules

## File Organization

```
src/
├── app/           # App Router pages and layouts
├── components/    # React components
│   ├── ui/        # Generic UI components
│   └── features/  # Feature-specific components
├── lib/           # Utilities and helpers
├── hooks/         # Custom React hooks
└── types/         # TypeScript types
```

## Component Rules

1. **Server Components by Default**
   - Only add "use client" when needed
   - Keep client components small and focused

2. **Colocation**
   - Keep related files together
   - Page-specific components in page folders

3. **Naming Conventions**
   - Components: PascalCase
   - Utilities: camelCase
   - Types: PascalCase with suffix (UserType, ApiResponse)

## Data Fetching

```typescript
// ✅ Server Component with async
async function Page() {
  const data = await fetchData();
  return <Component data={data} />;
}

// ❌ Avoid useEffect for data fetching
```

## Best Practices

- Use `loading.tsx` for suspense boundaries
- Use `error.tsx` for error boundaries
- Prefer Server Actions over API routes
- Use `revalidatePath` for cache invalidation
