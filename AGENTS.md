# AGENTS.md — AI Agent Instructions for `99names`

> **Canonical instruction file.** All AI coding agents (Copilot, Claude, Codex, etc.) should read this file before making any changes to this repository.

<!-- BEGIN:nextjs-agent-rules -->
## Next.js notice

This project uses **Next.js 16 App Router** — not the classic Pages Router. APIs, conventions, and file structure differ significantly from older versions in your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## Project identity

- **99names** is an open-source multilingual learning aid for the 99 Names of Allah (Asmaul Husna).
- Languages: English (EN), German (DE), Turkish (TR).
- It is a public benefit project — not a theological authority.
- Content is cautious, source-aware, and open for community review.
- Religious content **must not** invent sources, virtues, fixed dhikr counts, guaranteed outcomes, or unsupported claims.

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16 App Router |
| UI | React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| Push subscriptions | Supabase + Web Push |
| Analytics | Vercel Analytics + Speed Insights |
| Testing | Vitest + Testing Library |
| Linting | ESLint |
| Deployment | Vercel |

---

## Required checks

Before finishing **any** code change, run all four checks in order:

```sh
npm run lint
npm run typecheck
npm run test
npm run build
```

- Fix failures **caused by your change**.
- If a pre-existing failure cannot be fixed without scope creep, document it clearly in your output.
- Do not remove or skip existing tests to make the suite pass.

---

## Non-negotiable coding rules

### Religious content
- Do not change religious content casually or without explicit instruction.
- Do not add theological claims without explicit source notes.
- Do not add fixed-number rituals (e.g., "read 99 times for X").
- Do not add guaranteed worldly or spiritual outcomes.
- Prefer cautious, hedged wording for any benefit statements.

### Privacy and tracking
- Do not introduce tracking, cookies (beyond functional), ads, user accounts, or profiling.
- Keep privacy policy text aligned with actual runtime behaviour.
- Do not claim "no analytics" if Vercel Analytics is active.
- Do not claim "no server storage" if Supabase push subscriptions or Web3Forms processing are used.
- If a feature uses localStorage, Supabase, Web Push, Web3Forms, Vercel Analytics, or Speed Insights, the privacy policy **must** describe it accurately.
- Contact form UI text must not contradict the privacy policy.

### Secrets and environment variables
- Keep all secrets **server-only**.
- Never expose or log:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `VAPID_PRIVATE_KEY`
  - `CRON_SECRET`
  - Database credentials
- `NEXT_PUBLIC_*` values are sent to the browser — they must **never** contain secrets.
- API routes that use secrets must validate authorization before processing.

### Internationalisation
- Preserve multilingual behaviour for English, German, and Turkish.
- Do not break localized URLs, SEO metadata, or localized alternates.
- Keep `hreflang` and `lang` attributes consistent.

### PWA / offline
- Preserve offline/PWA behaviour.
- Keep service worker changes conservative and always increment the cache version when changing cached assets.

### Routing and SEO
- Do not break existing routes, sitemap, or `robots.txt`.
- Keep SEO metadata consistent with page content.

### Dependencies
- Do not add unnecessary dependencies.
- Do not upgrade major versions of dependencies unless that is the explicit task.

---

## Content rules (`src/data/names.ts`)

- Keep exactly **99 entries**.
- Keep IDs sequential from 1 to 99.
- Keep slugs unique and URL-safe.
- Keep DE, TR, and EN fields complete for every entry.
- Quran references must be well-formed (Surah:Ayah format).
- Do not add fake hadith references.
- Do not add fixed-number dhikr rituals.
- Do not add guaranteed worldly outcomes.

---

## Architecture rules

- **Server-only code stays server-only.** Never import server modules from client components.
- Supabase admin client must only be instantiated on the server.
- Storage helpers must be SSR-safe (guard `typeof window` where needed).
- Client components must not import modules marked `server-only`.
- Keep the root-level `proxy.ts` for request routing logic and response header handling (not `middleware.ts`).

---

## Out of scope

- Do not modify application functionality unless it is strictly necessary to fulfil the instruction task.
- Do not touch unrelated files.
- Do not introduce legal/imprint placeholder text.
