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
- Native Web Push learning reminders for `2h`, `6h`, and `daily` intervals.

## Tech Stack

Next.js App Router, React, TypeScript strict mode, Tailwind CSS, Supabase Postgres, Web Push, Vercel Cron, ESLint, Vitest, Testing Library, and jsdom.

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

`public/manifest.webmanifest` defines the installable app metadata and icons. `public/sw.js` caches the basic app shell, core routes, manifest, and icons, and also handles native push notifications. Names data is bundled with the app, so cached pages can continue to show the local dataset offline after the app shell has been cached.

Limits:

- Offline support is basic app-shell caching, not full background sync.
- The contact form requires network access.
- First visit must be online so the service worker can install and cache assets.

## Web Push Reminders

Generate VAPID keys:

```bash
npx web-push generate-vapid-keys
```

Required environment variables:

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:admin@example.com
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CRON_SECRET=replace_with_a_long_random_secret
```

`NEXT_PUBLIC_VAPID_PUBLIC_KEY` is intentionally public. Keep `VAPID_PRIVATE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and `CRON_SECRET` server-only. The Supabase service role key is used only by App Router API routes.

Supabase SQL setup:

```sql
create table if not exists public.push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  reminder_interval text not null check (reminder_interval in ('2h', '6h', 'daily')),
  timezone text not null default 'UTC',
  next_send_at timestamptz not null,
  last_sent_at timestamptz,
  disabled_at timestamptz,
  locked_until timestamptz,
  failed_count integer not null default 0,
  last_error text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_due_idx
  on public.push_subscriptions (next_send_at)
  where disabled_at is null;

create table if not exists public.push_delivery_logs (
  id bigint generated always as identity primary key,
  endpoint text not null,
  status text not null check (status in ('sent', 'failed', 'expired')),
  error_message text,
  payload jsonb,
  created_at timestamptz not null default now()
);

create index if not exists push_delivery_logs_endpoint_created_idx
  on public.push_delivery_logs (endpoint, created_at desc);
```

Local testing:

```bash
npm run dev -- --experimental-https
```

Open the HTTPS local URL, enable notifications in the browser, then use the Settings page to enable reminders. To test the cron route locally, call:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://localhost:3000/api/cron/send-reminders
```

The Vercel cron is configured in `vercel.json` to call `/api/cron/send-reminders` every 15 minutes. Expired push subscriptions are disabled when the push service returns `404` or `410`; repeated failures disable a subscription after five failures.

iOS limitation: Push works only for installed Home Screen PWAs on iOS/iPadOS 16.4+.

Browser support caveat: Push delivery is not guaranteed exactly on time. It depends on browser, OS, battery mode, and user permissions.

## SEO Architecture

The SEO-critical pages are server-rendered App Router pages. Client components are used only for local progress, settings, and learning interactions, so crawlers can read the core content without JavaScript.

- `src/lib/seo.ts` centralizes `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL` handling, canonical paths, hreflang alternates, Open Graph/Twitter metadata, localized name URLs, and sitemap entries.
- `src/lib/structuredData.ts` builds and sanitizes JSON-LD for `WebSite`, `Organization`, `BreadcrumbList`, `ItemList`, and `LearningResource` data.
- `src/app/sitemap.ts` includes the required static routes plus English, German, and Turkish detail routes for all 99 names.
- `src/app/robots.ts` allows public crawling and references `/sitemap.xml`.
- English is the default route group. `/de` and `/tr` use separate root layouts so their rendered documents have the correct `lang` attribute.
- SEO landing pages for Asma ul Husna, learning, dua, reflections, and quiz have localized English, German, and Turkish routes with page-specific metadata and hreflang alternates.
- Name detail pages use `generateStaticParams`, `dynamicParams = false`, and `generateMetadata` for static, canonical detail pages.

Religious content remains source-aware: source notes are visible on detail pages, review-required flags are preserved, and the common list is treated as a learning order rather than an unsupported authenticity claim for every individual entry.

## Learning Schedule

The local learning schedule still calculates `nextDueAt` while the app is open. Native Web Push reminders can also be enabled explicitly from Settings; they are stored as one subscription per browser/device and do not require accounts.

## Privacy Notes

The app stores language, learned IDs, favorite IDs, last viewed name, last learned name, schedule settings, and local push reminder UI state in `localStorage`. If push reminders are enabled, the server stores the browser push endpoint, push keys, reminder interval, timezone, user agent, delivery timestamps, failure state, and delivery logs in Supabase. It uses no tracking cookies and no analytics. Contact submissions are sent to Web3Forms only when configured and submitted by the user.

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
