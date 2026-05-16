import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function proxy(_request: NextRequest) {
  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.webmanifest|sw.js|.*\\..*).*)'],
}
