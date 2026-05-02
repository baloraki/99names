import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { proxy } from './proxy'

describe('proxy', () => {
  it('redirects unlocalized English content routes to the browser language', () => {
    const request = new NextRequest('https://99names.app/learn', {
      headers: { 'accept-language': 'de-DE,de;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toBe('https://99names.app/de/lernen')
  })

  it('prefers an existing language cookie over the browser header', () => {
    const request = new NextRequest('https://99names.app/quiz', {
      headers: {
        cookie: 'app_language=tr',
        'accept-language': 'de-DE,de;q=0.9,en;q=0.8',
      },
    })

    const response = proxy(request)

    expect(response.headers.get('location')).toBe('https://99names.app/tr/quiz')
  })

  it('stores the locale when a prefixed route is opened directly', () => {
    const request = new NextRequest('https://99names.app/de/namen')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.cookies.get('app_language')?.value).toBe('de')
  })

  it('redirects settings to the preferred localized settings route', () => {
    const request = new NextRequest('https://99names.app/settings', {
      headers: { cookie: 'app_language=de' },
    })

    const response = proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toBe('https://99names.app/de/einstellungen')
    expect(response.cookies.get('app_language')?.value).toBe('de')
  })

  it('stores the locale when a localized settings route is opened directly', () => {
    const request = new NextRequest('https://99names.app/tr/ayarlar')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(response.cookies.get('app_language')?.value).toBe('tr')
  })

  it('keeps English settings on the English route for English preference', () => {
    const request = new NextRequest('https://99names.app/settings', {
      headers: { cookie: 'app_language=en' },
    })

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(response.cookies.get('app_language')?.value).toBe('en')
  })

  it('redirects unlocalized privacy route to preferred localized route', () => {
    const request = new NextRequest('https://99names.app/privacy', {
      headers: { cookie: 'app_language=tr' },
    })

    const response = proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toBe('https://99names.app/tr/gizlilik')
    expect(response.cookies.get('app_language')?.value).toBe('tr')
  })

  it('keeps localized static route when already localized', () => {
    const request = new NextRequest('https://99names.app/de/impressum')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
    expect(response.cookies.get('app_language')?.value).toBe('de')
  })

  it('sets security headers on normal responses', () => {
    const request = new NextRequest('https://99names.app/de/namen')

    const response = proxy(request)

    const csp = response.headers.get('content-security-policy')
    expect(response.status).toBe(200)
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("require-trusted-types-for 'script'")
    expect(response.headers.get('strict-transport-security')).toBe('max-age=63072000; includeSubDomains; preload')
    expect(response.headers.get('cross-origin-opener-policy')).toBe('same-origin')
    expect(response.headers.get('x-frame-options')).toBe('DENY')
  })

  it('sets security headers on redirects', () => {
    const request = new NextRequest('https://99names.app/privacy', {
      headers: { cookie: 'app_language=tr' },
    })

    const response = proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toBe('https://99names.app/tr/gizlilik')
    expect(response.headers.get('content-security-policy')).toContain("trusted-types nextjs nextjs-bundler")
    expect(response.headers.get('strict-transport-security')).toBe('max-age=63072000; includeSubDomains; preload')
  })
})
