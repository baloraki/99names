import type { NameEntry } from '@/types/name'
import type { Language } from '@/types/language'

export function searchNames(names: NameEntry[], query: string, language: Language = 'en'): NameEntry[] {
  const q = query.trim().toLowerCase()
  if (!q) return names
  return names.filter(name => {
    return (
      name.transliteration.toLowerCase().includes(q) ||
      name.arabic.includes(q) ||
      name.meanings[language].toLowerCase().includes(q) ||
      name.slug.includes(q) ||
      String(name.id).includes(q)
    )
  })
}
