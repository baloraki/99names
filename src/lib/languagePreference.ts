import type { Language } from '@/types/language'
export const DEFAULT_LANGUAGE: Language = 'en'
export function isLanguage(value: unknown): value is Language {
  return value === 'de' || value === 'tr' || value === 'en'
}
export function normalizeLanguageCandidate(value: string | null | undefined): Language | null {
  if (!value) return null
  const normalized = value.trim().toLowerCase()
  if (normalized.startsWith('de')) return 'de'
  if (normalized.startsWith('tr')) return 'tr'
  if (normalized.startsWith('en')) return 'en'
  return null
}
export function pickPreferredLanguage(candidates: Iterable<string | null | undefined>): Language {
  for (const candidate of candidates) {
    const matchedLanguage = normalizeLanguageCandidate(candidate)
    if (matchedLanguage) return matchedLanguage
  }
  return DEFAULT_LANGUAGE
}
export function getBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return DEFAULT_LANGUAGE
  return pickPreferredLanguage([...navigator.languages, navigator.language])
}
