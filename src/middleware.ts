import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect /en and /en/* to the equivalent unprefixed English URLs
  if (pathname === '/en') {
    return NextResponse.redirect(new URL('/', request.url), 301)
  }
  if (pathname.startsWith('/en/')) {
    const newPath = pathname.replace(/^\/en/, '') || '/'
    return NextResponse.redirect(new URL(newPath, request.url), 301)
  }

  // Skip if already on a localized path
  if (pathname.startsWith('/de') || pathname.startsWith('/tr')) return
  // Skip API routes, static files, etc.
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) return

  // 302 redirect based on language cookie or Accept-Language for root path only
  if (pathname === '/') {
    const cookieLang = request.cookies.get('language')?.value
    if (cookieLang === 'de') {
      return NextResponse.redirect(new URL('/de', request.url), 302)
    }
    if (cookieLang === 'tr') {
      return NextResponse.redirect(new URL('/tr', request.url), 302)
    }
    if (cookieLang === 'en') {
      // User explicitly prefers English — do not redirect
      return
    }
    const acceptLanguage = request.headers.get('accept-language') || ''
    if (acceptLanguage.startsWith('de')) {
      return NextResponse.redirect(new URL('/de', request.url), 302)
    }
    if (acceptLanguage.startsWith('tr')) {
      return NextResponse.redirect(new URL('/tr', request.url), 302)
    }
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - de, tr (localized paths — already have their own layouts)
     * - api (API routes)
     * - favicon.ico, icon.svg, manifest, etc.
     */
    '/((?!_next/static|_next/image|de|tr|api|favicon.ico|icon.svg|icon-192.png|manifest.webmanifest|robots.txt|sitemap.xml).*)',
  ],
}
