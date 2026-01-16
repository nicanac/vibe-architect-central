---
description: Refactor Next.js app to mutualize recurring UI parts and enforce official project structure.
---

# Refactor, Mutualize & Structure Workflow

Step 1: **Analyze, Plan & Check Standards**

- **Review Documentation:** Access and read the Next.js Project Structure documentation at: `https://nextjs.org/docs/app/getting-started/project-structure`.
- **Analyze Current Structure:** Scan the current project directories. Compare the existing folder hierarchy against the "Top-level folders" and "File conventions" defined in the documentation.
- **Identify UI Patterns:** Scan `src/` for recurring code (headers, footers, navs, etc ...).
- **Formulate Plan:** update TASKS markdown to create a phase that lists:
  1.  Structural changes needed to match the documentation (e.g., moving source code to `src/`, organizing `public/` assets).
  2.  Files containing duplicated code to be mutualized.
  3.  Where new shared components will be created.
- specific_instruction: "Do not modify code yet. detailed plan must be confirmed by the user before proceeding." 4. If needed ask the user for more information

Step 2: **Enforce Project Structure**

- Apply the folder structure conventions from the documentation checked in Step 1.
- If not already present and appropriate for this project, move application code into an `src/` directory (optional but recommended in docs for separation).
- Ensure the `app/` directory uses correct file conventions (`layout.tsx`, `page.tsx`, `loading.tsx`, `not-found.tsx`, `error.tsx`) rather than custom names for these roles.
- Organize static assets into the `public/` folder if they are currently scattered.

Step 3: **Create Shared Components**

- Create a `Header` component for navigation/logo logic.
- Create a `Footer` component for links/copyright logic.
- Place these in `src/components/` (or `components/`) to align with the "clean separation" pattern found in the docs.

Step 4: **Refactor Layouts & Pages**

- **Root Layout:** Open `app/layout.tsx`. Implement the `<Header />` and `<Footer />` there so they persist globally.
- **Cleanup:** Remove hardcoded headers and footers from individual `page.tsx` files.
- **Optimization:** Ensure `metadata` objects are defined in `layout.tsx` or `page.tsx` as per the "Metadata file conventions".

Step 5: **Verify & Build**
// turbo

- Run `npm run build` to ensure the structure changes didn't break imports.
- Browsing check: Verify the home page loads with the new layout.

Step 6: **Update the documentation**
// turbo

- to ensure the structure changes will be used for future update, review and adapt the memory-bank to fit what has been changed.
