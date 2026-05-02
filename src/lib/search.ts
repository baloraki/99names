import type { NameEntry } from '@/types/name'
import type { Language } from '@/types/language'

export function searchNames(names: NameEntry[], query: string, language: Language = 'en'): NameEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return names
  return names.filter(name => {
    const transliterations = Object.values(name.transliteration)
    const pronunciations = Object.values(name.pronunciation)
    return (
      transliterations.some((value) => value.toLowerCase().includes(q)) ||
      pronunciations.some((value) => value.toLowerCase().includes(q)) ||
      name.arabic.includes(q) ||
      name.meanings[language].toLowerCase().includes(q) ||
      name.slug.includes(q) ||
      String(name.id).includes(q)
    )
  })
}
