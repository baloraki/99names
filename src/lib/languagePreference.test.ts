import { describe, expect, it } from 'vitest'
import {
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
})
