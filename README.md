# 99 Names

Open-source learning aid for the 99 Names of Allah — cautious, source-aware, and open for review.

A mobile-first PWA built with Next.js App Router. The app supports **German**, **Turkish**, and **English** and provides searchable name cards with meanings, reflections, dua usage, and personal progress tracking.

## Features

- 99 local `NameEntry` records with Arabic, transliteration, pronunciation, meaning, explanation, dua usage, reflection, and review notes.
- Search by Arabic, transliteration, slug, ID, or selected-language meaning.
- Filters for all, learned, favorites, and open names.
- Local progress tracking (learned names, favorites, last viewed, language, schedule).
- Optional contact form integration via Web3Forms.
- PWA manifest + service worker for app-shell caching and offline fallback.
- Native Web Push reminders (`2h`, `6h`, `daily`) with Supabase-backed subscriptions.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Supabase (Postgres)
- Vitest + Testing Library
- ESLint

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Available Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
```

## Environment Variables

### Required for legal pages (build-time)

The privacy/imprint pages require these values. Missing values will fail `next build`.

```bash
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_OPERATOR_NAME=
NEXT_PUBLIC_OPERATOR_STREET=
NEXT_PUBLIC_OPERATOR_CITY=
NEXT_PUBLIC_OPERATOR_COUNTRY=   # defaults to "Schweiz" if unset
NEXT_PUBLIC_SUPABASE_PROJECT_REGION=
```

### Optional: contact form

```bash
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=
```

This value is intentionally public (`NEXT_PUBLIC_*`) and visible in the client bundle.

### Optional: push reminders

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@example.com
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=
```

Keep `VAPID_PRIVATE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `CRON_SECRET` server-only.

## PWA + Push Notes

- `public/manifest.webmanifest` defines install metadata.
- `public/sw.js` handles caching + push event handling.
- First visit must be online so the service worker can install.
- iOS push support requires installed Home Screen PWA on iOS/iPadOS 16.4+.

## Content & Religious Disclaimer

This project is a learning aid, **not** a theological authority.
Content is intentionally cautious and should be reviewed by qualified scholars before public religious use.
The content is source-aware and open for review. Corrections, source improvements, and qualified feedback are welcome.

## Privacy Notes

The app stores language and learning state in `localStorage`.
If push reminders are enabled, push subscription metadata and delivery logs are stored in Supabase.
Vercel Analytics and Vercel Speed Insights are enabled for aggregate usage/performance insights.
No tracking cookies are used by default.

## Project Structure

- `src/app/` — App Router routes and global CSS
- `src/components/` — UI components
- `src/data/names.ts` — local 99-name dataset
- `src/hooks/` — state hooks
- `src/lib/` — helpers (search, SEO, storage, validation, i18n, schedule)
- `src/types/` — shared types
- `public/` — manifest, service worker, icons

## Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Run checks locally:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   ```
4. Open a pull request with a clear description.

## Security

Please see [SECURITY.md](./SECURITY.md) for responsible disclosure instructions.

## License

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE).
