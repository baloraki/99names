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

  it('uses the browser language header for unlocalized routes', () => {
    const request = new NextRequest('https://99names.app/quiz', {
      headers: {
        'accept-language': 'de-DE,de;q=0.9,en;q=0.8',
      },
    })

    const response = proxy(request)

    expect(response.headers.get('location')).toBe('https://99names.app/de/quiz')
  })

  it('keeps prefixed routes without redirecting', () => {
    const request = new NextRequest('https://99names.app/de/namen')

    const response = proxy(request)

    expect(response.status).toBe(200)
  })

  it('redirects settings to the preferred localized settings route', () => {
    const request = new NextRequest('https://99names.app/settings', {
      headers: { 'accept-language': 'de-DE,de;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toBe('https://99names.app/de/einstellungen')
  })

  it('keeps localized settings route when opened directly', () => {
    const request = new NextRequest('https://99names.app/tr/ayarlar')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('keeps English settings on the English route for English preference', () => {
    const request = new NextRequest('https://99names.app/settings', {
      headers: { 'accept-language': 'en-US,en;q=0.9' },
    })

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('redirects unlocalized privacy route to preferred localized route', () => {
    const request = new NextRequest('https://99names.app/privacy', {
      headers: { 'accept-language': 'tr-TR,tr;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toBe('https://99names.app/tr/gizlilik')
  })

  it('keeps localized static route when already localized', () => {
    const request = new NextRequest('https://99names.app/de/impressum')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
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
      headers: { 'accept-language': 'tr-TR,tr;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBeGreaterThanOrEqual(300)
    expect(response.status).toBeLessThan(400)
    expect(response.headers.get('location')).toBe('https://99names.app/tr/gizlilik')
    expect(response.headers.get('content-security-policy')).toContain("trusted-types nextjs-bundler")
    expect(response.headers.get('strict-transport-security')).toBe('max-age=63072000; includeSubDomains; preload')
  })
})
