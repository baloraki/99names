# 99 Names

A mobile-first Next.js App Router learning aid for the 99 Names of Allah. The app supports German, Turkish, and English, with German as the default.

## Features

- 99 local `NameEntry` records with Arabic, transliteration, pronunciation, meanings, explanations, dua usage, reflection, and review notes.
- Search by Arabic, transliteration, slug, ID, or selected-language meaning.
- Filters for all, learned, favorites, and open names.
- Local progress, favorites, last viewed name, selected language, and learning schedule settings.
- In-app learning schedule hints for `2h`, `6h`, and `daily`.
- Contact form using Web3Forms when `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` is configured.
- PWA manifest and service worker with basic app-shell caching and offline fallback.

## Tech Stack

Next.js App Router, React, TypeScript strict mode, Tailwind CSS, ESLint, Vitest, Testing Library, and jsdom.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
```

## Web3Forms

Set:

```bash
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key
```

This key is intentionally a `NEXT_PUBLIC_` variable and is visible in the browser bundle. For real secret protection, a Next.js Route Handler or Server Action should proxy the submission with a server-only secret.

If the key is missing, the contact form validates input but blocks submit.

## PWA And Offline

`public/manifest.webmanifest` defines the installable app metadata and icons. `public/sw.js` caches the basic app shell, core routes, manifest, and icons. Names data is bundled with the app, so cached pages can continue to show the local dataset offline after the app shell has been cached.

Limits:

- Offline support is basic app-shell caching, not full background sync.
- The contact form requires network access.
- First visit must be online so the service worker can install and cache assets.

## Learning Schedule Limits

The learning schedule is local in-app reminder logic only. It calculates `nextDueAt` for `2h`, `6h`, or `daily` intervals and shows hints while the app is open.

There are no push notifications and no browser notifications.

## Privacy Notes

The app stores language, learned IDs, favorite IDs, last viewed name, last learned name, and schedule settings in `localStorage`. It uses no tracking cookies and no analytics. Contact submissions are sent to Web3Forms only when configured and submitted by the user.

## Content Notes

This is a learning aid, not a theological authority. The wording is intentionally cautious, avoids fixed-number rituals and guaranteed effects, and does not invent theological source references. The general direction is intended to be broadly Sunni/Hanafi-compatible, but all religious content must be reviewed by qualified people before publication.

The imprint page is a placeholder. Operator data must be added before publication.

## Project Structure

- `src/app/` App Router pages and global CSS.
- `src/components/` Client UI and forms.
- `src/data/names.ts` The 99 local name records.
- `src/hooks/` Local app state hooks.
- `src/lib/` Search, filtering, progress, storage, validation, i18n, and schedule helpers.
- `src/types/` Shared TypeScript types.
- `public/` PWA manifest, service worker, and icons.
