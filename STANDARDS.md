# STANDARDS.md — Cross-Project Best Practices & Reusable Patterns

> **Canonical standards file.** Bind this to your AI agents (as AGENTS.md, CLAUDE.md, or via cursor rules) so every agent starts with these proven conventions before writing a single line of code.

---

## 1. Contact Form (Web3Forms)

Every project that needs a public contact form should use **Web3Forms** with this battle-tested pattern:

### 1.1 Component Structure
```
components/contact/ContactForm.tsx   — the form itself ('use client')
lib/validation.ts                    — pure validation function (SSR-safe)
hooks/useContactStorage.ts           — optional localStorage persistence
```

### 1.2 The Pattern

```tsx
'use client'

// States: 'idle' | 'loading' | 'success' | 'error' | 'missing-key'
const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'missing-key'>('idle')

// Validation (extract to lib/validation.ts — pure function):
function validateContactForm(data) {
  const errors = {}
  if (data.honeypot?.trim()) errors.honeypot = 'honeypot'
  if (!data.name.trim()) errors.name = 'nameRequired'
  if (!data.email.trim()) errors.email = 'emailRequired'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'emailInvalid'
  if (!data.message.trim()) errors.message = 'messageRequired'
  else if (data.message.length > 2000) errors.message = 'messageTooLong'
  return { valid: Object.keys(errors).length === 0, errors }
}

// Submit handler:
async function onSubmit(event) {
  event.preventDefault()
  const result = validateContactForm(values)
  if (!result.valid) return setErrors(result.errors)
  if (!key) return setStatus('missing-key')
  setStatus('loading')
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ access_key: key, name, email, message }),
    })
    if (!response.ok) throw new Error('send failed')
    setStatus('success')
    setValues({ name: '', email: '', message: '', honeypot: '' })
  } catch {
    setStatus('error')
  }
}
```

### 1.3 Required Elements (checklist)
- [ ] **Honeypot field** — visually hidden (`position:absolute;left:-9999px;opacity:0`), `tabIndex={-1}`, `autoComplete="off"`, `aria-hidden="true"`. If it has content → reject silently or show "Spam erkannt".
- [ ] **Client-side validation** — name (required, max 100), email (required, regex, max 200), message (required, max 2000).
- [ ] **Loading state** — disable submit button, show spinner, button text changes ("Wird gesendet…").
- [ ] **Success state** — confirmation message, fields reset.
- [ ] **Error state** — user-friendly error message, not raw exception text.
- [ ] **Missing key state** — graceful fallback ("Formular derzeit nicht verfügbar").
- [ ] **DSGVO/GDPR notice** — inside the form: explain that data goes via Web3Forms, link to privacy policy.
- [ ] **`noValidate`** on `<form>` — we use our own validation.
- [ ] **Error codes translated** — validation returns error codes (e.g. `'nameRequired'`), not user-facing strings. Map codes to localized messages in the component or i18n dict.
- [ ] **Accessibility** — `aria-invalid` on fields with errors, `aria-hidden` on required asterisk, labels with `htmlFor`.

### 1.4 i18n Support
If the project is multilingual, keep the privacy notice and status messages in the i18n dictionary:

```ts
contact: {
  name: string, email: string, message: string,
  send: string, sending: string,
  success: string, error: string, noKey: string,
}
validation: {
  nameRequired: string, emailRequired: string, emailInvalid: string,
  messageRequired: string, messageTooLong: string,
  honeypot: string,
}
```

---

## 2. Email Obfuscation

Never render a plaintext email address in HTML. Use this **multi-layer defense**:

### 2.1 Protection Layers
1. **No SSR** — server renders an invisible placeholder; real email only appears client-side.
2. **Base64 encoding** — plain email never exists in source or JS bundle.
3. **CSS `direction: rtl`** — DOM text is stored reversed; `unicode-bidi: bidi-override` flips it visually. Copy-paste yields garbage.
4. **`aria-label`** — screen readers get `[AT]` instead of `@` (still parseable by assistive tech but not regex scrapers).

### 2.2 Reference Implementation

```tsx
'use client'

const ENCODED = 'aW5mb0BleGFtcGxlLmNvbQ==' // base64 of full email

export function ObfuscatedEmail() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    startTransition(() => setEmail(window.atob(ENCODED)))
  }, [])

  if (!email) {
    return <span aria-hidden="true" className="opacity-0 select-none">···</span>
  }

  const reversed = email.split('').reverse().join('')

  return (
    <a
      href={`mailto:${email}`}
      style={{ unicodeBidi: 'bidi-override', direction: 'rtl' }}
      aria-label={email.replace('@', '[AT]')}
    >
      {reversed}
    </a>
  )
}
```

### 2.3 To encode a new email
```bash
echo -n "info@example.com" | base64
```

---

## 3. Error Handling & Error Pages

### 3.1 Next.js Error Boundary (app/error.tsx)
- Must be `'use client'`
- Receives `{ error, reset }` props
- Call `reset()` for retry, link to home as secondary action
- Show `error.digest` (monospace, muted) for debugging
- Log to console or structured logger in `useEffect`

### 3.2 Global Error (app/global-error.tsx)
- Same pattern but renders `<html><body>` directly (root layout is broken)
- Keep the design consistent: error code in background, title, message, retry + home buttons

### 3.3 404 Page (app/not-found.tsx)
- Simple: icon, "Seite nicht gefunden", link to home
- No client interactivity needed

### 3.4 Backend Error Envelope (NestJS / API)
All API errors should use a consistent JSON envelope:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "title": "Bad Request",
    "message": "email must be a valid email address",
    "details": { "field": "email" }
  }
}
```

Error codes as constants:

```ts
export const ERROR_CODES = {
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const
```

### 3.5 Frontend Error Logging
Log structured JSON to console (picked up by observability tools):

```ts
console.error(JSON.stringify({
  timestamp: new Date().toISOString(),
  level: 'error',
  event: 'frontend.critical_error',
  app: 'myapp-web',
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  route: window.location.pathname,
  error: { name: error.name, message: error.message, digest: error.digest },
}))
```

---

## 4. API Client Pattern (Frontend → Backend)

### 4.1 Typed Request Wrapper

```ts
// lib/api.ts

class ApiRequestError extends Error {
  status: number
  title: string
  code?: string
  details?: Record<string, unknown>
}

async function request<T>(path: string, init?: RequestOptions): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: await buildHeaders(init, auth),
  })
  if (!res.ok) throw await parseError(res)
  return res.json() as T
}
```

### 4.2 Key Features (checklist)
- [ ] **Typed responses** — every endpoint function returns `Promise<T>`
- [ ] **Structured error class** — `ApiRequestError` with `status`, `code`, `title`, `message`, `details`
- [ ] **Auth header injection** — read Supabase access token, attach `Authorization: Bearer <token>`
- [ ] **Request tracing** — auto-generate `X-Request-Id` UUID header
- [ ] **Loading indicator integration** — call `beginLoading()`/`endLoading()` around fetch
- [ ] **`no-store` cache** for authenticated or volatile endpoints
- [ ] **URLSearchParams** for query parameters (not string interpolation)

---

## 5. Type-Safe State Machines

For workflows with discrete states and role-based transitions:

```ts
type Status = 'pending' | 'accepted' | 'rejected' | 'preparing' | 'ready' | 'delivered'
type Action = 'accept' | 'reject' | 'prepare' | 'ready' | 'deliver'
type Role = 'admin' | 'operator' | 'customer'

const TRANSITIONS: Record<Status, readonly Status[]> = {
  pending: ['accepted', 'rejected'],
  accepted: ['preparing'],
  preparing: ['ready'],
  ready: ['delivered'],
  delivered: [],
  rejected: [],
}

const TERMINAL_STATUSES = new Set(['delivered', 'rejected'])

function canTransition(from: Status, to: Status, role: Role): TransitionDecision {
  if (!actionAllowedForRole(to, role)) return { ok: false, status: 403, message: '...' }
  if (!TRANSITIONS[from].includes(to)) return { ok: false, status: 422, message: '...' }
  return { ok: true }
}
```

### 5.1 Principles
- **Pure functions** — no DB, no framework. The persistence layer consults `canTransition()` before running the atomic UPDATE.
- **Terminal states** — clearly defined, no transitions out.
- **Role gating** — separate from edge validity: "is this a valid edge?" vs "may this role execute it?".
- **Return discriminated union** — `{ ok: true }` | `{ ok: false; status: 422 | 403; message: string }`.

---

## 6. Validation Module

Extract validation to a **pure, SSR-safe module**:

```ts
// lib/validation.ts

export type ValidationResult = {
  valid: boolean
  errors: Record<string, string>
}

export function validateContactForm(data: { ... }): ValidationResult {
  const errors: Record<string, string> = {}
  // ... checks
  return { valid: Object.keys(errors).length === 0, errors }
}
```

### 6.1 Conventions
- Return **error codes**, not user-facing strings (e.g. `'emailRequired'`, not `'Bitte E-Mail eingeben'`).
- The component or i18n layer maps codes to localized messages.
- Validation functions are pure — no `useState`, no DOM access.
- Honeypot check is part of validation, not a separate step.

---

## 7. Internationalization (i18n)

### 7.1 Type-Safe Dictionary

```ts
// lib/i18n.ts

export type Dict = {
  nav: {
    home: string
    names: string
    // ...
  }
  contact: {
    name: string
    email: string
    message: string
    send: string
    success: string
    // ...
  }
  validation: {
    nameRequired: string
    emailInvalid: string
    // ...
  }
}

const de: Dict = { /* every key filled */ }
const en: Dict = { /* every key filled */ }
const tr: Dict = { /* every key filled */ }

export function getDict(lang: Language): Dict {
  return { de, en, tr }[lang]
}
```

### 7.2 Rules
- **Every key must have a value in every language** — TypeScript enforces this via the `Dict` type.
- **Error codes are keys in `validation`** — no inline strings.
- **`getDict()` returns the dictionary** — components call it with the current language.
- **Localized routes** use path prefix convention (e.g. `/de/kontakt`, `/tr/iletisim`).

---

## 8. SEO Fundamentals

### 8.1 Metadata Builder

```ts
export function buildMetadata({ title, description, path, locale, alternates, type }): Metadata {
  return {
    title, description,
    alternates: { canonical: path, languages: alternates },
    openGraph: { title, description, url: path, type, images: [...], locale, alternateLocale },
    twitter: { card: 'summary_large_image', title, description, images: [...] },
    robots: { index: true, follow: true },
  }
}
```

### 8.2 Checklist
- [ ] **`robots.ts`** — explicit allow/disallow per route, sitemap URL
- [ ] **`sitemap.ts`** — all public pages with `priority`, `changeFrequency`, `alternates`
- [ ] **Canonical URLs** — every page, localized variants use `alternates.languages`
- [ ] **OG images** — dynamic generation via `api/og` route
- [ ] **hreflang** — correct `lang` on `<html>`, alternates in metadata
- [ ] **JSON-LD** structured data — breadcrumbs, item lists, FAQ

---

## 9. Security Headers

### 9.1 Via `proxy.ts` (Next.js)

```ts
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://api.web3forms.com https://vitals.vercel-insights.com",
  "manifest-src 'self'",
  "form-action 'self'",
  'require-trusted-types-for \'script\'',
  'trusted-types nextjs-bundler',
  'upgrade-insecure-requests',
].join('; ')

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('X-Frame-Options', 'DENY')
  return response
}
```

### 9.2 Principles
- **CSP is strict** — whitelist only what's needed. Update `connect-src` when adding new API endpoints.
- **`proxy.ts` for security headers**, `middleware.ts` for routing logic — keep them separate.
- **Header logic goes in `proxy.ts`**, not in layout or page components.

---

## 10. Auth & Authorization

### 10.1 Supabase Client Pattern

```ts
// lib/supabase/server.ts — server-side (cookies)
import { createServerClient } from '@supabase/ssr'

// lib/supabase/client.ts — browser-side (singleton)
import { createBrowserClient } from '@supabase/ssr'
```

### 10.2 Role Resolution
**Always use `app_metadata.base_role`** (set by server-side auth hook), never `user_metadata`.

```ts
function getEffectiveRole(user: AuthUser): string | null {
  const baseRole = user.app_metadata?.base_role
  if (typeof baseRole === 'string') return baseRole.trim().toLowerCase()
  const role = user.app_metadata?.role
  if (typeof role === 'string') return role.trim().toLowerCase()
  return null
}
```

### 10.3 Route Protection (proxy.ts for Next.js)
```ts
const ALLOWED_ROLES = ['admin', 'operator', 'staff']
if (isProtectedPath(pathname) && !ALLOWED_ROLES.includes(role)) {
  return NextResponse.redirect(new URL('/login', request.url))
}
```

### 10.4 Principles
- **Auth check in `proxy.ts`** — no per-page auth checks.
- **`app_metadata` is trusted** — `user_metadata` is client-modifiable (in Supabase, via `updateUser`).
- **Disabled users** get a specific message, not a generic 403.
- **Never expose `SUPABASE_SERVICE_ROLE_KEY`** — server-only.
- **`NEXT_PUBLIC_*` env vars go to the browser** — never put secrets in them.

---

## 11. localStorage / Client State

### 11.1 Versioned Keys

```ts
const STORAGE_KEYS = {
  PROGRESS: 'app:v1:progress',
  LANGUAGE: 'app:v1:language',
  THEME:   'app:v1:theme',
} as const
```

### 11.2 SSR-Safe Access

```ts
const isClient = typeof window !== 'undefined'

function getItem<T>(key: string): T | null {
  if (!isClient) return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : null
  } catch { return null }
}
```

### 11.3 Runtime Type Guards
Always validate deserialized data:

```ts
function isValidContact(value: unknown): value is StoredContact {
  if (!value || typeof value !== 'object') return false
  const r = value as Record<string, unknown>
  return typeof r.name === 'string' && typeof r.email === 'string'
}
```

### 11.4 Principles
- **Versioned namespace** — `app:v1:*` allows future schema migration without conflicts.
- **SSR-safe guard** — `typeof window !== 'undefined'` at every entry point.
- **`try/catch` on JSON.parse** — corrupted storage must not crash.
- **Type guard on read** — deserialized data is `unknown`, always validate before use.
- **Defaults** — every key has a well-defined default value if missing or corrupt.

---

## 12. Rate Limiting (Backend)

### 12.1 Interceptor Pattern (NestJS)

```ts
@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const configs = this.getConfigs(context)
    for (const config of configs) {
      const result = await this.rateLimitService.check(bucketKey, config.windowSec, config.limit)
      response.setHeader('X-RateLimit-Limit', config.limit)
      response.setHeader('X-RateLimit-Remaining', result.remaining)
      response.setHeader('X-RateLimit-Reset', Math.ceil(Date.now() / 1000) + result.retryAfter)
      if (!result.allowed) {
        response.setHeader('Retry-After', String(result.retryAfter))
        throw new HttpException({ message: 'Too Many Requests' }, 429)
      }
    }
    return next.handle()
  }
}
```

### 12.2 Principles
- **Bucket key** — either `ip:<ip>:<group>` (unauthenticated) or `user:<userId>:<group>` (authenticated).
- **Config via decorators** — method-level overrides class-level.
- **Informative headers** — `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `Retry-After`.

---

## 13. Email Templates

### 13.1 Pure Function Pattern

```ts
type EmailResult = { subject: string; html: string }

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function renderShell(content: string): string {
  return `<!doctype html>...shell with brand colors...</html>`
}

export function buildOrderConfirmation(data: OrderData): EmailResult {
  const subject = 'Deine Bestellung wurde bestätigt'
  const html = renderShell(`<h1>Danke, ${escapeHtml(data.name)}.</h1>...`)
  return { subject, html }
}
```

### 13.2 Rules
- **Always `escapeHtml()` user-supplied values** — name, order details, anything that comes from DB/user input.
- **Return `{ subject, html }`** — consistent interface.
- **Shell is reusable** — `renderShell()` wraps content with brand header, footer, and styles.
- **Table-based layout** — email clients still need `<table role="presentation">`.

---

## 14. UI Component Conventions

### 14.1 Component Structure
```
components/ui/
├── Button.tsx     — variant/size props, CSS variable tokens
├── Badge.tsx
├── Card.tsx
├── Chip.tsx
├── Icon.tsx       — name-based icon lookup
└── index.ts       — barrel export
```

### 14.2 Button Pattern

```tsx
type Variant = 'primary' | 'dark' | 'mint' | 'outline' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'xl'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  leading?: ReactNode
  trailing?: ReactNode
  block?: boolean
}

// Use CSS variables for tokens, not hardcoded colors:
// var(--bb-primary), var(--bb-ink), var(--bb-mint), etc.
```

### 14.3 Principles
- **CSS variable tokens** — design tokens defined once, components reference them.
- **`variant` + `size` props** — not infinite customization, constrained design system.
- **`block` for full-width** — not a separate component.
- **`leading`/`trailing` slots** — for icons, spinners, etc.
- **Barrel export** — `index.ts` re-exports all components.

---

## 15. NestJS Backend Architecture

### 15.1 Module Structure
```
src/
├── module-name/
│   ├── module-name.module.ts
│   ├── module-name.controller.ts
│   ├── module-name.service.ts
│   ├── module-name.dto.ts
│   └── module-name.types.ts
├── guards/
│   ├── roles.guard.ts
│   ├── roles.decorator.ts
│   └── roles.constants.ts
├── filters/
│   ├── http-exception.filter.ts
│   └── error-codes.ts
├── rate-limit/
│   ├── rate-limit.module.ts
│   ├── rate-limit.interceptor.ts
│   ├── rate-limit.decorator.ts
│   └── rate-limit.service.ts
└── observability/
    ├── structured-logger.ts
    └── request-context.ts
```

### 15.2 Principles
- **DTOs use `class-validator` decorators** — `@IsUUID()`, `@IsEmail()`, `@IsEnum()`, `@MaxLength()`, `@MinLength()`.
- **DTOs are classes** (not interfaces) — NestJS decorators require runtime metadata.
- **Error codes are constants** — never magic strings in throw statements.
- **Global exception filter** — one `@Catch()` handler, consistent error envelope.
- **Role guard** — decorator-based (`@Roles('admin')`), resolves `app_metadata.base_role`.

---

## 16. Legal Pages Pattern

### 16.1 Reusable Layout

```tsx
function LegalPageLayout({ title, subtitle, tocItems, children }) {
  return (
    <div className="max-w-[1280px] mx-auto px-4 py-12">
      <Link href="/">← Zurück</Link>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      {/* TOC navigation pills linking to #section-ids */}
      <nav>{tocItems.map(item => <a href={`#${item.id}`}>{item.title}</a>)}</nav>
      <article>{children}</article>
      {/* Contact CTA at bottom */}
      <div>Noch Fragen? <Link href="/kontakt">Zum Kontaktformular</Link></div>
    </div>
  )
}
```

### 16.2 Rules
- **Operator data from `NEXT_PUBLIC_*` env vars** — never hardcoded.
- **Privacy policy must match actual runtime services** — if you add analytics, update the policy.
- **Contact CTA at page bottom** — consistent across all legal pages.

---

## 17. Robots & Sitemap

### 17.1 `robots.ts`
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', disallow: ['/settings', '/api/'] },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### 17.2 Rules
- **Disallow** `/settings`, `/contact`, `/privacy`, `/imprint`, `/offline`, `/api/` — functional pages don't need indexing.
- **Don't add disallowed pages to sitemap** — Google rejects conflicting sitemaps.
- **`priority` and `changeFrequency`** on every sitemap entry.

---

## 18. Dependencies & Upgrades

### 18.1 Rules
- **Don't add unnecessary dependencies** — every dependency is a supply-chain risk and bundle weight.
- **Don't upgrade major versions unless that's the explicit task** — upgrading `next`, `react`, `tailwind` can cascade.
- **Use `@/*` path alias** — configured in `tsconfig.json`, no relative imports beyond one level.

---

## 19. Pre-Commit Checklist

Before finishing any change:

```sh
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run test        # Vitest / Jest / pytest
npm run build       # next build / nest build
```

- Fix failures **caused by your change**.
- If pre-existing failures can't be fixed without scope creep, document them clearly.
- Never remove or skip existing tests to make the suite pass.

---

## 20. Environment Variables

### 20.1 Naming Convention
- `NEXT_PUBLIC_*` → goes to the browser, **never contains secrets**.
- `SUPABASE_SERVICE_ROLE_KEY` → server-only, never in `NEXT_PUBLIC_*`.
- `CRON_SECRET` → server-only, validates cron job authenticity.
- `VAPID_PRIVATE_KEY` → server-only, Web Push encryption.

### 20.2 Principles
- **Server-only code stays server-only** — never import server modules from client components.
- **Use `server-only` package** to enforce this at build time.
- **API routes validate authorization** before processing.

---

## 21. PWA / Service Worker

### 21.1 Checklist
- **`manifest.webmanifest`** — name, icons, theme color, display mode.
- **`sw.js`** — cache versioning, offline fallback.
- **Increment cache version** when changing cached assets.
- **Register in `RootDocument`** via a client component (SSR-safe).

---

## 22. Fonts & Design Tokens

### 22.1 Font Loading (Next.js)
```ts
// app/fonts.ts
import { Inter, Noto_Naskh_Arabic } from 'next/font/google'

export const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans' })
export const fontArabic = Noto_Naskh_Arabic({ subsets: ['arabic'], variable: '--font-arabic' })
```

### 22.2 CSS Variables
- Set on `<html>` via `className={fontSans.variable}`
- Referenced in Tailwind via `font-sans`, `font-arabic`

---

## 23. Client/Server Component Boundary

### 23.1 Rules
- **Server components can import client components**, never the reverse.
- **`'use client'` boundary at the leaf level** — not on layouts or page files when possible.
- **Page files can be server components** — only add `'use client'` when you need hooks, event handlers, or browser APIs.
- **Separate client wrapper** — e.g. `page.tsx` (server) imports `page.client.tsx` (`'use client'`) for interactive parts.

---

## 24. The `cn()` Utility

Every project should have this 3-line utility:

```ts
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
```

No need for `clsx` or `classnames` packages — this handles 95% of cases.

---

## 25. TypeScript Strictness

### 25.1 Use throughout
- **`strict: true` in `tsconfig.json`**.
- **Runtime type guards** for `localStorage`, API responses, URL params.
- **`as const` for constants** — enables exhaustive switch checks.
- **Discriminated unions** for state machines and result types.

---

*Last updated: June 2025. Extracted from production Next.js/NestJS projects.*
