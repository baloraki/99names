import { describe, expect, it } from 'vitest'
import {
  createLanguageCookie,
  getLanguageFromCookieHeader,
  normalizeLanguageCandidate,
  pickPreferredLanguage,
} from './languagePreference'

describe('languagePreference', () => {
  it('normalizes locale variants to supported app languages', () => {
    expect(normalizeLanguageCandidate('de-DE')).toBe('de')
    expect(normalizeLanguageCandidate('tr-TR')).toBe('tr')
    expect(normalizeLanguageCandidate('en-US')).toBe('en')
    expect(normalizeLanguageCandidate('fr-FR')).toBeNull()
  })

  it('picks the first supported preferred language', () => {
    expect(pickPreferredLanguage(['fr-FR', 'tr-TR', 'de-DE'])).toBe('tr')
    expect(pickPreferredLanguage(['es-ES'])).toBe('en')
  })

  it('reads the language cookie safely', () => {
    expect(getLanguageFromCookieHeader('theme=dark; app_language=de')).toBe('de')
    expect(getLanguageFromCookieHeader('theme=dark')).toBeNull()
    expect(getLanguageFromCookieHeader(`app_language=%65%6e; other=${encodeURIComponent('x=y')}`)).toBe('en')
  })

  it('creates a persistent language cookie', () => {
    expect(createLanguageCookie('tr')).toContain('app_language=tr')
    expect(createLanguageCookie('tr')).toContain('Path=/')
    expect(createLanguageCookie('tr')).toContain('SameSite=Lax')
  })
})
