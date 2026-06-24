# CLAUDE.md

See **[AGENTS.md](./AGENTS.md)** for all project instructions, coding rules, content rules, and required checks.

## Claude-specific guidance

### When exploring this codebase
- The project uses `@/*` path alias mapped to `./src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
- Tests are co-located with source files using `*.test.ts` / `*.test.tsx` naming.
- ESLint uses flat config (`eslint.config.mjs`) — not `.eslintrc.*`.
- Tailwind CSS 4 uses `@import "tailwindcss"` and `@theme` blocks — not `tailwind.config.*`.

### When writing code
- Prefer pure functions in `src/lib/` modules — keep React state in hooks (`src/hooks/`) and components (`src/components/`).
- Add runtime type guards (like `isLanguage`, `isThemeName`, `isCard`) when parsing from localStorage, API responses, or URL params.
- New localized routes need entries in all three locale layouts plus the SEO path map in `src/lib/seo.ts`.
- When adding dictionary keys to `Dict` in `src/lib/i18n.ts`, every key must have values in all three language objects (`de`, `tr`, `en`).
- Server components can import client components, but never the reverse.
- The `'use client'` boundary should be at the leaf component level when possible — not on layout or page files.

### When debugging
- `npm run typecheck` runs `tsc --noEmit` — it catches imports of `server-only` modules from client code.
- The push notification system is intentionally disabled. If you see commented-out Supabase/push code, do not uncomment it unless explicitly asked.
- `src/lib/supabase/server.ts` is entirely commented out — importing it will fail at build time.

### When reviewing content changes
- Content changes in `src/data/names.ts` must preserve the exact 99+1 entry structure.
- Privacy policy content in `src/components/PrivacyPageContent.tsx` must match the actual services running (Vercel Analytics, Speed Insights, Simple Analytics, Web3Forms — and Supabase/Web Push only if re-enabled).
- Imprint content in `src/components/ImprintPageContent.tsx` must use operator data from `NEXT_PUBLIC_*` env vars, never hardcoded placeholder data.

### CI expectations
- GitHub Actions runs lint → typecheck → test → build on every push to `main` and every PR.
- All four must pass for a PR to be mergeable.
- The `next-patch` branch is auto-synced to `main` by a workflow — never commit directly to it.
