---
description: Project-wide coding standards for Next.js 14+ App Router projects
---

# Next.js App Router Project Rules

## File Organization

```
src/
├── app/           # App Router pages and layouts
│   ├── (auth)/    # Route group for auth pages (no global Header)
│   └── layout.tsx # Root layout with Header/Footer
├── components/    # React components
│   ├── layout/    # Global layout components (Header, Footer)
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

## Layout Rules

1. **Global Layout** (`app/layout.tsx`)

   - Contains Header and Footer components
   - Wraps children in flex container for sticky footer
   - Do NOT add Header/Footer to individual pages

2. **Route Groups vs. Standard Routes**

   - **Route Groups `(name)`**: Architectural folders for layout organization. **Does not** affect URL path.
     - Example: `(auth)/login` -> accessed as `/login`.
     - Use for: Sharing layouts (e.g., `(auth)/layout.tsx`) or colocating code without changing routes.
   - **Standard Routes `name`**: API or Page folders. **Does** affect URL path.
     - Example: `auth/callback` -> accessed as `/auth/callback`.
     - Use for: Actual route segments, API endpoints, or functional callbacks.

3. **Nested Layouts**
   - Feature layouts add structure within global layout
   - Example: `instructions/layout.tsx` adds sidebar

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
