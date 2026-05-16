import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { proxy } from './proxy'

describe('proxy', () => {
  it('does not redirect / with Accept-Language: de', () => {
    const request = new NextRequest('https://learnhusna.cc/', {
      headers: { 'accept-language': 'de-DE,de;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('does not redirect / with Accept-Language: tr', () => {
    const request = new NextRequest('https://learnhusna.cc/', {
      headers: { 'accept-language': 'tr-TR,tr;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('does not redirect /names with Accept-Language: de', () => {
    const request = new NextRequest('https://learnhusna.cc/names', {
      headers: { 'accept-language': 'de-DE,de;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('does not redirect /learn with Accept-Language: tr', () => {
    const request = new NextRequest('https://learnhusna.cc/learn', {
      headers: { 'accept-language': 'tr-TR,tr;q=0.9,en;q=0.8' },
    })

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('does not redirect /de', () => {
    const request = new NextRequest('https://learnhusna.cc/de')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('does not redirect /tr', () => {
    const request = new NextRequest('https://learnhusna.cc/tr')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('does not redirect localized routes', () => {
    const request = new NextRequest('https://learnhusna.cc/de/namen')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('location')).toBeNull()
  })

  it('does not redirect any route regardless of Accept-Language', () => {
    const paths = ['/settings', '/privacy', '/quiz', '/dua', '/reflections', '/about', '/contact', '/imprint']
    for (const path of paths) {
      const request = new NextRequest(`https://learnhusna.cc${path}`, {
        headers: { 'accept-language': 'de-DE,de;q=0.9,en;q=0.8' },
      })

      const response = proxy(request)

      expect(response.status).toBe(200)
      expect(response.headers.get('location')).toBeNull()
    }
  })

  it('sets security headers on responses', () => {
    const request = new NextRequest('https://learnhusna.cc/de/namen')

    const response = proxy(request)

    const csp = response.headers.get('content-security-policy')
    expect(response.status).toBe(200)
    expect(csp).toContain("default-src 'self'")
    expect(csp).toContain("frame-ancestors 'none'")
    expect(csp).toContain("require-trusted-types-for 'script'")
    expect(csp).toContain("trusted-types nextjs-bundler")
    expect(response.headers.get('strict-transport-security')).toBe('max-age=63072000; includeSubDomains; preload')
    expect(response.headers.get('cross-origin-opener-policy')).toBe('same-origin')
    expect(response.headers.get('x-frame-options')).toBe('DENY')
  })

  it('sets security headers on all routes including root', () => {
    const request = new NextRequest('https://learnhusna.cc/')

    const response = proxy(request)

    expect(response.status).toBe(200)
    expect(response.headers.get('strict-transport-security')).toBe('max-age=63072000; includeSubDomains; preload')
    expect(response.headers.get('x-frame-options')).toBe('DENY')
  })
})
