# GitHub Copilot Instructions

See **[AGENTS.md](../AGENTS.md)** for the full canonical agent instructions.

## Quick-reference: most important rules

- **Framework:** Next.js 16 App Router — read `node_modules/next/dist/docs/` before generating code.
- **Languages:** TypeScript strict mode, React 19, Tailwind CSS 4.
- **No secrets in the browser.** Never put `SUPABASE_SERVICE_ROLE_KEY`, `VAPID_PRIVATE_KEY`, `CRON_SECRET`, or database credentials in `NEXT_PUBLIC_*` vars or client code.
- **No theological invention.** Do not add unverified religious claims, fake hadith citations, fixed dhikr counts, or guaranteed outcomes.
- **Preserve multilingual support** for English, German, and Turkish (routes, metadata, hreflang).
- **Preserve PWA/offline behaviour** and bump cache version on any service-worker cache change.
- **Privacy policy must match reality.** If you add/change a feature using localStorage, Supabase, Web Push, Web3Forms, or analytics, update the privacy policy accordingly.
- **Required checks before finishing any change:**
  ```sh
  npm run lint
  npm run typecheck
  npm run test
  npm run build
  ```
- **`src/data/names.ts`:** exactly 99 entries, sequential IDs 1–99, unique URL-safe slugs, all DE/TR/EN fields complete.
- Do not add unnecessary dependencies.
- Do not touch unrelated files.
