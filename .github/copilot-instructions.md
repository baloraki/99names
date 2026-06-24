# GitHub Copilot Instructions

See **[AGENTS.md](../AGENTS.md)** for the full canonical agent instructions.

## Quick-reference: most important rules

- **Framework:** Next.js 16.2 App Router — read `node_modules/next/dist/docs/` before generating code.
- **Languages:** TypeScript 6 strict mode, React 19.2, Tailwind CSS 4.
- **No secrets in the browser.** Never put `SUPABASE_SERVICE_ROLE_KEY`, `VAPID_PRIVATE_KEY`, `CRON_SECRET`, or database credentials in `NEXT_PUBLIC_*` vars or client code.
- **No theological invention.** Do not add unverified religious claims, fake hadith citations, fixed dhikr counts, or guaranteed outcomes.
- **Preserve multilingual support** for English, German, and Turkish (routes, metadata, hreflang).
- **Preserve PWA/offline behaviour** and bump cache version on any service-worker cache change.
- **Privacy policy must match reality.** If you add/change a feature using localStorage, Supabase, Web Push, Web3Forms, Vercel Analytics, Speed Insights, or Simple Analytics, update the privacy policy accordingly.
- **Required checks before finishing any change:**
  ```sh
  npm run lint
  npm run typecheck
  npm run test
  npm run build
  ```
- **`src/data/names.ts`:** exactly 99 entries + 1 `firstName`, sequential IDs 1–99, unique URL-safe slugs, all DE/TR/EN fields complete.
- **Push notification system is currently disabled** — do not uncomment push/Supabase code unless explicitly instructed.
- **Tests are co-located** with source (`.test.ts` / `.test.tsx` naming).
- **`server-only` package** enforces server/client boundaries — never import server modules from client components.
- Do not add unnecessary dependencies.
- Do not touch unrelated files.
