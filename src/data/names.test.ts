import { describe, expect, it } from 'vitest'
import { names } from './names'

const languages = ['de', 'tr', 'en'] as const

describe('names data', () => {
  it('contains exactly 99 names with IDs 1-99', () => {
    expect(names).toHaveLength(99)
    expect(names.map((name) => name.id)).toEqual(Array.from({ length: 99 }, (_, index) => index + 1))
  })

  it('has unique IDs and URL-safe slugs', () => {
    expect(new Set(names.map((name) => name.id)).size).toBe(99)
    expect(new Set(names.map((name) => name.slug)).size).toBe(99)
    for (const name of names) {
      expect(name.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })

  it('fills required multilingual fields and review flags', () => {
    for (const name of names) {
      expect(name.arabic).toBeTruthy()
      expect(name.transliteration).toBeTruthy()
      expect(name.pronunciation).toBeTruthy()
      expect(typeof name.contentReviewRequired).toBe('boolean')
      for (const language of languages) {
        expect(name.meanings[language]).toBeTruthy()
        expect(name.explanations[language]).toBeTruthy()
        expect(name.duaUsage[language]).toBeTruthy()
        expect(name.reflection?.[language]).toBeTruthy()
        expect(name.sourceNote?.[language]).toBeTruthy()
      }
    }
  })

  it('does not make invented source references', () => {
    const content = JSON.stringify(names).toLowerCase()
    // Detects formatted citation claims like "Bukhari 123" / "Hadith no. 456".
    expect(content).not.toMatch(/\b(?:sahih|bukhari|muslim|tirmidhi|hadith)\s*(?:no\.?|nr\.?|#)?\s*\d+\b/)
  })

  it('avoids guarantee wording, fixed-number rituals, and guaranteed effects', () => {
    const content = JSON.stringify(names).toLowerCase()
    const bannedGuaranteeClaims = [
      /\balways works\b/,
      /\bwird garantiert\b/,
      /\bkesin olarak\b/,
      /\bguaranteed effect\b/,
      /\bhealing promise\b/,
      /\bheilversprechen\b/,
      /\bşifa garantisi\b/,
    ]
    for (const pattern of bannedGuaranteeClaims) {
      expect(content).not.toMatch(pattern)
    }
    expect(content).not.toMatch(/\b(7|11|33|99|100)\s*(times|mal|kez)\b/)
  })
})
