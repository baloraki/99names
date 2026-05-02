import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Language } from '@/types/language'
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_COOKIE_MAX_AGE,
  LANGUAGE_COOKIE_NAME,
  getLanguageFromCookieHeader,
  pickPreferredLanguage,
} from '@/lib/languagePreference'

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
  "worker-src 'self' blob:",
  "form-action 'self'",
  "require-trusted-types-for 'script'",
  'trusted-types nextjs nextjs#bundler',
  'upgrade-insecure-requests',
].join('; ')

function applySecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY)
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('X-Frame-Options', 'DENY')
  return response
}

function getRouteLanguage(pathname: string): Language | null {
  if (pathname === '/de' || pathname.startsWith('/de/')) return 'de'
  if (pathname === '/tr' || pathname.startsWith('/tr/')) return 'tr'
  return null
}

function getLocalizedPathname(pathname: string, language: Language): string | null {
  if (pathname === '/' || pathname === '/de' || pathname === '/tr') {
    if (language === 'de') return '/de'
    if (language === 'tr') return '/tr'
    return '/'
  }

  if (pathname === '/names' || pathname === '/de/namen' || pathname === '/tr/esmaul-husna') {
    if (language === 'de') return '/de/namen'
    if (language === 'tr') return '/tr/esmaul-husna'
    return '/names'
  }

  const detailMatch = pathname.match(/^\/names\/([^/]+)$|^\/de\/namen\/([^/]+)$|^\/tr\/esmaul-husna\/([^/]+)$/)
  const slug = detailMatch?.[1] ?? detailMatch?.[2] ?? detailMatch?.[3]
  if (slug) {
    if (language === 'de') return `/de/namen/${slug}`
    if (language === 'tr') return `/tr/esmaul-husna/${slug}`
    return `/names/${slug}`
  }

  if (pathname === '/settings' || pathname === '/de/einstellungen' || pathname === '/tr/ayarlar') {
    if (language === 'de') return '/de/einstellungen'
    if (language === 'tr') return '/tr/ayarlar'
    return '/settings'
  }

  const staticPages: Record<string, Record<Language, string>> = {
    '/about': { en: '/about', de: '/de/uber-uns', tr: '/tr/hakkimizda' },
    '/de/uber-uns': { en: '/about', de: '/de/uber-uns', tr: '/tr/hakkimizda' },
    '/tr/hakkimizda': { en: '/about', de: '/de/uber-uns', tr: '/tr/hakkimizda' },
    '/contact': { en: '/contact', de: '/de/kontakt', tr: '/tr/iletisim' },
    '/de/kontakt': { en: '/contact', de: '/de/kontakt', tr: '/tr/iletisim' },
    '/tr/iletisim': { en: '/contact', de: '/de/kontakt', tr: '/tr/iletisim' },
    '/privacy': { en: '/privacy', de: '/de/datenschutz', tr: '/tr/gizlilik' },
    '/de/datenschutz': { en: '/privacy', de: '/de/datenschutz', tr: '/tr/gizlilik' },
    '/tr/gizlilik': { en: '/privacy', de: '/de/datenschutz', tr: '/tr/gizlilik' },
    '/imprint': { en: '/imprint', de: '/de/impressum', tr: '/tr/kunye' },
    '/de/impressum': { en: '/imprint', de: '/de/impressum', tr: '/tr/kunye' },
    '/tr/kunye': { en: '/imprint', de: '/de/impressum', tr: '/tr/kunye' },
  }

  if (staticPages[pathname]) {
    return staticPages[pathname][language]
  }

  const seoPages: Record<string, Record<Language, string>> = {
    '/asma-ul-husna': { en: '/asma-ul-husna', de: '/de/asma-ul-husna', tr: '/tr/esmaul-husna-nedir' },
    '/de/asma-ul-husna': { en: '/asma-ul-husna', de: '/de/asma-ul-husna', tr: '/tr/esmaul-husna-nedir' },
    '/tr/esmaul-husna-nedir': { en: '/asma-ul-husna', de: '/de/asma-ul-husna', tr: '/tr/esmaul-husna-nedir' },
    '/learn': { en: '/learn', de: '/de/lernen', tr: '/tr/ogren' },
    '/de/lernen': { en: '/learn', de: '/de/lernen', tr: '/tr/ogren' },
    '/tr/ogren': { en: '/learn', de: '/de/lernen', tr: '/tr/ogren' },
    '/dua': { en: '/dua', de: '/de/dua', tr: '/tr/dua' },
    '/de/dua': { en: '/dua', de: '/de/dua', tr: '/tr/dua' },
    '/tr/dua': { en: '/dua', de: '/de/dua', tr: '/tr/dua' },
    '/reflections': { en: '/reflections', de: '/de/reflexionen', tr: '/tr/tefekkur' },
    '/de/reflexionen': { en: '/reflections', de: '/de/reflexionen', tr: '/tr/tefekkur' },
    '/tr/tefekkur': { en: '/reflections', de: '/de/reflexionen', tr: '/tr/tefekkur' },
    '/quiz': { en: '/quiz', de: '/de/quiz', tr: '/tr/quiz' },
    '/de/quiz': { en: '/quiz', de: '/de/quiz', tr: '/tr/quiz' },
    '/tr/quiz': { en: '/quiz', de: '/de/quiz', tr: '/tr/quiz' },
  }

  return seoPages[pathname]?.[language] ?? null
}

function getPreferredLanguage(request: NextRequest): Language {
  const cookieLanguage = getLanguageFromCookieHeader(request.headers.get('cookie'))
  if (cookieLanguage) return cookieLanguage

  const acceptLanguage = request.headers.get('accept-language')
  const acceptedLocales = acceptLanguage?.split(',').map((value) => value.split(';')[0]) ?? []

  return pickPreferredLanguage(acceptedLocales)
}

function setLanguageCookie(response: NextResponse, language: Language): NextResponse {
  response.cookies.set({
    name: LANGUAGE_COOKIE_NAME,
    value: language,
    path: '/',
    sameSite: 'lax',
    maxAge: LANGUAGE_COOKIE_MAX_AGE,
  })

  return response
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const routeLanguage = getRouteLanguage(pathname)

  if (routeLanguage) {
    return applySecurityHeaders(setLanguageCookie(NextResponse.next(), routeLanguage))
  }

  const preferredLanguage = getPreferredLanguage(request)
  const localizedPathname = getLocalizedPathname(pathname, preferredLanguage)

  if (localizedPathname && localizedPathname !== pathname) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = localizedPathname
    return applySecurityHeaders(setLanguageCookie(NextResponse.redirect(redirectUrl), preferredLanguage))
  }

  const response = NextResponse.next()

  if (preferredLanguage !== DEFAULT_LANGUAGE || pathname === '/' || pathname === '/names' || pathname === '/settings') {
    setLanguageCookie(response, preferredLanguage)
  }

  return applySecurityHeaders(response)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|sw.js|.*\\..*).*)'],
}

export { getLocalizedPathname, getPreferredLanguage, getRouteLanguage }
