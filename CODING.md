# CODING.md — Verbindliche Coding-Regeln

> **Tabelle-basiert** — neue Regeln einfach als Zeile ergänzen.  
> Diese Datei wird von AI-Agenten als Coding-Style-Referenz eingelesen.

## TypeScript / JavaScript

| #  | Regel                                                          | Beispiel ❌                                  | Beispiel ✅                                                          |
|----|----------------------------------------------------------------|---------------------------------------------|---------------------------------------------------------------------|
| 1  | Keine inline `if` ohne Klammern                                | `if (x) return y`                           | `if (x) { return y }`                                               |
| 2  | Keine ternary in return bei mehr als einer Bedingung           | `return a ? b ? c : d : e`                  | `if/else`-Block verwenden                                           |
| 3  | `const` bevor `let`, niemals `var`                             | `let x = 1`                                 | `const x = 1`                                                       |
| 4  | `async/await` statt raw Promise-Ketten                         | `.then(() => ...).then(...)`                | `const x = await fn()`                                              |
| 5  | `try/catch` um jedes `await`, das fehlschlagen kann            | `const data = await fetch(...)`             | `try { const data = await fetch(...) } catch { ... }`               |
| 6  | Kein `any` — `unknown` verwenden und type-guarden              | `(x as any).field`                          | `if (typeof x === 'object') { ... }`                                |
| 7  | `as const` für Konstanten-Arrays/Objekte                       | `const ROLES = ['admin']`                   | `const ROLES = ['admin'] as const`                                  |
| 8  | Discriminated Unions statt optionaler Felder                   | `{ status, result? }`                       | `{ ok: true; value: T } \| { ok: false; error: string }`            |
| 9  | Type Guards für `unknown` aus localStorage/API                 | `const data = JSON.parse(raw)`              | `const data: unknown = JSON.parse(raw); if (isValid(data)) { ... }` |
| 10 | Keine Magic Strings — Konstanten verwenden                     | `if (status === 'delivered')`               | `if (status === TERMINAL_STATUSES.delivered)`                       |
| 11 | `Readonly<>` und `ReadonlySet/Array` für öffentliche Contracts | `TRANSITIONS: Record<...>`                  | `TRANSITIONS: Readonly<Record<...>>`                                |
| 12 | `satisfies` für Typ-Prüfung ohne Type-Widening                 | `{ path: '/', priority: 1 }`                | `{ path: '/', priority: 1 } as const satisfies SitemapEntry`        |
| 13 | String-Interpolation statt Concat                              | `'Hello ' + name + '!'`                     | `` `Hello ${name}!` ``                                              |
| 14 | Optional Chaining statt `&&`-Ketten                            | `x && x.y && x.y.z`                         | `x?.y?.z`                                                           |
| 15 | Nullish Coalescing für Defaults                                | `value \|\| 'default'` (fängt `''` und `0`) | `value ?? 'default'`                                                |
| 16 | `Array.isArray()` statt `typeof` für Arrays                    | `typeof x === 'array'`                      | `Array.isArray(x)`                                                  |
| 17 | `for...of` statt `forEach` bei `async`                         | `items.forEach(async (i) => { await ... })` | `for (const i of items) { await ... }`                              |
| 18 | Keine Seiteneffekte in `reduce`/`map`/`filter`                 | `arr.map(x => { counter++; return x })`     | `for`-Loop oder vorher deklarieren                                  |
| 19 | Early Return statt tiefe Verschachtelung                       | 4+ Level `if`-Nesting                       | `if (!x) return; // main logic`                                     |
| 20 | Genau ein `export`-Style pro Modul bevorzugen                  | Mix aus `export default` + named            | Entweder `export function` ODER `export default`                    |

## React / Next.js

| #  | Regel                                                          | Beispiel ❌                                            | Beispiel ✅                                           |
|----|----------------------------------------------------------------|-------------------------------------------------------|------------------------------------------------------|
| 21 | `'use client'` nur auf Leaf-Komponenten                        | `'use client'` auf `layout.tsx`                       | `'use client'` auf Button, Form, etc.                |
| 22 | Server-Komponenten importieren nie Client-Only-Module          | `import { useState }` in Server Component             | Client-Komponente wrappen                            |
| 23 | `useEffect` für Side-Effects, nicht für derived State          | `useEffect(() => setFull(first+last), [first, last])` | `const full = first + last`                          |
| 24 | `useMemo` / `useCallback` nur bei echten Performance-Problemen | Alles wrappen „zur Sicherheit"                        | Nur bei teuren Berechnungen oder Referenz-Stabilität |
| 25 | Keine Props-Drilling über 2 Level — Composition oder Context   | `Parent → Child → Grandchild`                         | Children-as-props oder Context                       |
| 26 | Formulare mit `noValidate` + eigener Validation                | Native Browser-Validation                             | Eigene `validate()` + `aria-invalid`                 |
| 27 | Zugänglichkeit: `aria-*` Attribute immer setzen                | `<div onClick={...}>Click</div>`                      | `<button aria-label=...>`                            |
| 28 | Bilder immer mit `alt` (oder `alt=""` bei dekorativ)           | `<img src={...}>`                                     | `<img src={...} alt="Beschreibung">`                 |
| 29 | Keine Index-als-Key in Listen                                  | `key={i}`                                             | `key={item.id}`                                      |
| 30 | `dangerouslySetInnerHTML` nur mit eigenem Sanitizing           | `dangerouslySetInnerHTML={{ __html: userInput }}`     | Eigene `escapeHtml()` vorher                         |

## NestJS / Backend

| #  | Regel                                                                 | Beispiel ❌                               | Beispiel ✅                                                  |
|----|-----------------------------------------------------------------------|------------------------------------------|-------------------------------------------------------------|
| 31 | DTOs mit `class-validator` Decorators                                 | Manuelle `if`-Validation im Controller   | `@IsEmail() email: string`                                  |
| 32 | Error Codes als Konstanten, nicht inline                              | `throw new HttpException('kaputt', 500)` | `throw new HttpException(ERROR_CODES.VALIDATION, 400)`      |
| 33 | Global Exception Filter — ein `@Catch()` Handler                      | Jeder Controller fängt selbst            | Ein `HttpExceptionFilter` in `main.ts` registriert          |
| 34 | `app_metadata.base_role` für Auth, nie `user_metadata`                | `user.user_metadata?.role`               | `user.app_metadata?.base_role`                              |
| 35 | Rate Limiting via Interceptor, nicht pro-Endpoint                     | Manueller Counter pro Route              | `@RateLimit({ windowSec: 60, limit: 10 })`                  |
| 36 | Service-Layer hält Business-Logik — Controller nur HTTP               | Business-Logik in `controller.ts`        | Controller ruft `service.doBusiness()`                      |
| 37 | `POST` für Create, `PATCH` für Partial Update, nie `PUT` für beides   | `PUT /order/123` für Status-Update       | `PATCH /order/123` für Status-Update                        |
| 38 | Response-Envelope einheitlich: `{ error?: { code, title, message } }` | `res.json({ message: 'kaputt' })`        | `res.status(400).json({ error: { code, title, message } })` |

## Allgemein / Architektur

| #  | Regel                                                            | Beispiel ❌                                          | Beispiel ✅                                                |
|----|------------------------------------------------------------------|-----------------------------------------------------|-----------------------------------------------------------|
| 39 | Pure Functions wo möglich — keine DB/HTTP in lib-Modulen         | `lib/order.ts` ruft Supabase auf                    | `lib/order-state-machine.ts` ist pure                     |
| 40 | Keine zirkulären Imports                                         | `A → B → A`                                         | Gemeinsamen Typ in `types.ts` auslagern                   |
| 41 | Env-Vars: `NEXT_PUBLIC_*` nie mit Secrets                        | `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`             | `SUPABASE_SERVICE_ROLE_KEY` (ohne `NEXT_PUBLIC_`)         |
| 42 | `server-only` Package für Server-Module                          | Client importiert `supabase/server.ts`              | `import 'server-only'` in `server.ts`                     |
| 43 | `try/catch` an jeder I/O-Grenze (fetch, DB, localStorage)        | `const data = await fetch(...).then(r => r.json())` | `try { const res = await fetch(...); ... } catch { ... }` |
| 44 | Keine `console.log` in Production — strukturierten Logger nutzen | `console.log('order created')`                      | `logger.info('order.created', { orderId })`               |
| 45 | Keine Secrets loggen — nie                                       | `console.log({ token })`                            | `console.log({ token: token.slice(0,4) + '***' })`        |
| 46 | Dead Code löschen, nicht auskommentieren                         | `// oldFunction()`                                  | Löschen; Git History behält es                            |
| 47 | `TODO`/`FIXME` immer mit Ticket-Referenz                         | `// TODO: fix later`                                | `// TODO(BRI-123): fix later`                             |
| 48 | Pre-Commit: `lint` → `typecheck` → `test` → `build`              | Nur `build` checken                                 | Alle 4 in CI-Pipeline                                     |

---

> **Neue Regeln ergänzen:** Einfach eine neue Zeile in der passenden Tabelle einfügen.  
> Format: `| # | Regel | ❌ | ✅ |`
