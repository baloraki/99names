import type { Language } from '@/types/language'
export const DEFAULT_LANGUAGE: Language = 'en'
export const LANGUAGE_COOKIE_NAME = 'app_language'
export const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365
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
export function getLanguageFromCookieHeader(cookieHeader: string | null | undefined): Language | null {
  if (!cookieHeader) return null
  for (const segment of cookieHeader.split(';')) {
    const [rawName, ...rawValueParts] = segment.trim().split('=')
    if (rawName !== LANGUAGE_COOKIE_NAME) continue
    const rawValue = rawValueParts.join('=')
    try {
      const decodedValue = decodeURIComponent(rawValue)
      return isLanguage(decodedValue) ? decodedValue : null
    } catch {
      return null
    }
  }
  return null
}
export function createLanguageCookie(language: Language): string {
  return `${LANGUAGE_COOKIE_NAME}=${encodeURIComponent(language)}; Max-Age=${LANGUAGE_COOKIE_MAX_AGE}; Path=/; SameSite=Lax`
}
export function createClearedLanguageCookie(): string {
  return `${LANGUAGE_COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`
}
