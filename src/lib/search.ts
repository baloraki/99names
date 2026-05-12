import type { NameEntry } from '@/types/name'
import type { Language } from '@/types/language'

function normalizeSearchText(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/\u0640/g, '')
    .toLowerCase()
    .trim()
}

export function searchNames(names: NameEntry[], query: string, language: Language = 'en'): NameEntry[] {
  const q = normalizeSearchText(query)
  if (!q) return names
  return names.filter(name => {
    const transliterations = Object.values(name.transliteration)
    const pronunciations = Object.values(name.pronunciation)
    return (
      transliterations.some((value) => normalizeSearchText(value).includes(q)) ||
      pronunciations.some((value) => normalizeSearchText(value).includes(q)) ||
      normalizeSearchText(name.arabic).includes(q) ||
      normalizeSearchText(name.meanings[language]).includes(q) ||
      normalizeSearchText(name.slug).includes(q) ||
      String(name.id).includes(q)
    )
  })
}
