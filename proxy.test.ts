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
})
