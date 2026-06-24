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

## Coding Standards

See [STANDARDS.md](./STANDARDS.md) for cross-project best practices on forms, error handling, auth, i18n, SEO, email templates, and more.

See [CODING.md](./CODING.md) for hard coding rules (no inline ifs, no `any`, early return, etc.) — table format, add your own.

---

## Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router) |
| UI | React 19.2 |
| Language | TypeScript 6 (strict mode) |
| Styling | Tailwind CSS 4 |
| Animation | framer-motion 12 |
| Push subscriptions | Supabase + Web Push (currently disabled – code preserved in comments) |
| Analytics | Vercel Analytics + Speed Insights + Simple Analytics |
| Testing | Vitest 4 + Testing Library + jsdom |
| Linting | ESLint 9 (flat config via `eslint-config-next`) |
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
- Do not claim "no analytics" if Vercel Analytics, Speed Insights, or Simple Analytics are active.
- Do not claim "no server storage" if Supabase push subscriptions or Web3Forms processing are used.
- If a feature uses localStorage, Supabase, Web Push, Web3Forms, Vercel Analytics, Speed Insights, or Simple Analytics, the privacy policy **must** describe it accurately.
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
- Do not break the `manifest.webmanifest`, `sw.js`, or PWA icon assets in `public/`.

### Routing and SEO
- Do not break existing routes, sitemap, or `robots.txt`.
- Keep SEO metadata consistent with page content.
- `robots.txt` disallows `/settings`, `/contact`, `/privacy`, `/imprint`, `/offline`, and `/api/` in all locales — do not add those to the sitemap.

### Dependencies
- Do not add unnecessary dependencies.
- Do not upgrade major versions of dependencies unless that is the explicit task.

---

## Content rules (`src/data/names.ts`)

- Keep exactly **99 entries** in the `names` array.
- Keep IDs sequential from 1 to 99.
- Keep slugs unique and URL-safe.
- Keep DE, TR, and EN fields complete for every entry.
- The `firstName` entry (id: 0, slug: "allah") is a standalone foundational entry — not counted in the 99.
- Quran references must be well-formed (Surah:Ayah format).
- Do not add fake hadith references.
- Do not add fixed-number dhikr rituals.
- Do not add guaranteed worldly outcomes.

---

## Architecture rules

### Server/client separation
- **Server-only code stays server-only.** Never import server modules from client components.
- Supabase admin client must only be instantiated on the server (`src/lib/supabase/server.ts`).
- Storage helpers must be SSR-safe (guard `typeof window` where needed via `isClient` pattern).
- Client components must not import modules marked `server-only` (the `server-only` package enforces this at build time).
- Keep the root-level `proxy.ts` for security header injection (CSP, HSTS, COOP, X-Frame-Options). Do not use `middleware.ts` for response header manipulation.

### Middleware vs. proxy
- `src/middleware.ts` — handles language-based redirects only (en→/ redirect, cookie/Accept-Language detection).
- `proxy.ts` (root level) — injects security headers on all page responses. Never moves header logic into middleware.

### Localization
- English routes use pathless route group `(en)/` at the app root (e.g., `/names`, `/learn`).
- German routes use `/de/` prefix (e.g., `/de/namen`, `/de/lernen`).
- Turkish routes use `/tr/` prefix (e.g., `/tr/esmaul-husna`, `/tr/ogren`).
- Each locale has its own `layout.tsx` that imports `RootDocument` with the correct `lang` and `shellLanguage`.
- SEO paths are centralized in `src/lib/seo.ts` via typed helpers: `getLocalizedNamePath`, `getLocalizedSeoPath`, `getLocalizedStaticPath`, etc.
- Two page categories use discriminated types: `LocalizedStaticPage` (about/contact/privacy/imprint) and `LocalizedSeoPage` (asma/learn/dua/reflections/quiz).
- The `LocalizedSeoPage` component provides a reusable shell for SEO landing pages with breadcrumbs, hreflang alternates, JSON-LD, and a consistent content structure.

### i18n dictionary
- All UI strings are in `src/lib/i18n.ts` typed as `Dict` with tri-lingual constants (`de`, `tr`, `en`).
- Dictionary keys are fully typed — adding a key requires entries in all three languages.
- The `getDict(lang)` function returns the dictionary for a given locale.

### localStorage state
- All user state is client-side only — no server-side user accounts.
- 6 storage keys under `app:v1:*` namespace (defined in `src/lib/constants.ts`):
  - `PROGRESS` — learned IDs, favorite IDs, lastViewedSlug, updatedAt
  - `LANGUAGE` — current locale
  - `SCHEDULE` — learning reminder settings
  - `LEARN_STATE` — flashcard mode, shuffle, streak, repeat IDs
  - `THEME` — one of `dark-classic`, `blue-night`, `soft-light`
  - `SRS` — spaced repetition state (cards, promptPreference)
- The `storage` singleton in `src/lib/storage.ts` provides typed getters/setters for each key with SSR-safe guards.
- `data-theme` attribute is applied on `<html>` via inline script in `RootDocument` to prevent FOUC.

### Spaced repetition system (SRS)
- `src/lib/srs.ts` implements a pure-function SRS card scheduler (SM-2 inspired).
- Cards track `nextReviewDate` (epoch ms), `interval` (days), and `easeFactor`.
- Review grades: `hard`, `good`, `easy`.
- Prompt types: `meaning`, `transliteration`, `random`.
- The `useSpacedRepetition` hook in `src/hooks/useSpacedRepetition.ts` wires SRS state to React, re-evaluates due cards every 60 seconds and on visibility change.
- SRS state is validated on load via `parseSrsState` with runtime type guards.

### Push notification system (currently disabled)
- All push-related API routes (`/api/push/subscribe`, `/api/push/unsubscribe`) return HTTP 503.
- The cron route (`/api/cron/send-reminders`) returns HTTP 503.
- `src/lib/supabase/server.ts` is entirely commented out.
- Client-side push code in `src/lib/push/client.ts` remains active for type exports but is not wired to any active backend.
- `PushPermissionNudge` component import is commented out in `AppShell.tsx`.
- When re-enabling: uncomment the Supabase client, API route bodies, cron handler, and re-enable the nudge component. Then set all required env vars (VAPID keys, Supabase credentials, CRON_SECRET).

### Analytics
- Vercel Analytics and Speed Insights are loaded via dedicated Next.js components in `RootDocument`.
- Simple Analytics is loaded via an external `<Script>` tag with `strategy="lazyOnload"`.
- All three analytics services must be disclosed in the privacy policy.

### Fonts
- `src/app/fonts.ts` configures Inter (sans-serif, Latin) and Noto Naskh Arabic (serif, Arabic) via `next/font/google`.
- CSS variables `--font-sans` and `--font-arabic` are set on `<html>`.

### Structured data
- `src/lib/structuredData.ts` generates JSON-LD for: website, breadcrumbs, item lists, and FAQ pages.
- `serializeJsonLd` sanitizes output (undefined/null removal, `<` escaping) before embedding.

### OG images
- `GET /api/og` renders dynamic Open Graph images via `next/og` `ImageResponse` (Edge runtime).
- Image parameters: `title`, `subtitle`, `locale`.

---

## Out of scope

- Do not modify application functionality unless it is strictly necessary to fulfil the instruction task.
- Do not touch unrelated files.
- Do not introduce legal/imprint placeholder text.
