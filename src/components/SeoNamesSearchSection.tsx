'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'
import { getLocalizedNamePath } from '@/lib/seo'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'

interface SeoNamesSearchSectionProps {
  locale: Language
  variant: 'dua' | 'reflections'
  names: NameEntry[]
}

const emptyStateByLocale: Record<Language, string> = {
  de: 'Keine Namen gefunden für',
  en: 'No names found for',
  tr: 'Şu arama için isim bulunamadı',
}

const placeholderByLocale: Record<Language, string> = {
  de: 'Namen suchen …',
  en: 'Search names…',
  tr: 'İsim ara…',
}

const clearByLocale: Record<Language, string> = {
  de: 'Suche löschen',
  en: 'Clear search',
  tr: 'Aramayı temizle',
}

const normalizeForSearch = (value: string): string => value
  .normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .replace(/[-'`'\s]/g, '')
  .toLowerCase()

export function SeoNamesSearchSection({ locale, variant, names }: SeoNamesSearchSectionProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlSearch = searchParams.get('search') ?? ''
  const [searchTerm, setSearchTerm] = useState(urlSearch)
  const [prevUrlSearch, setPrevUrlSearch] = useState(urlSearch)

  // Derived-state pattern: sync URL → input for back/forward navigation.
  // Skip when the URL change was caused by our own router.replace (values match).
  if (prevUrlSearch !== urlSearch) {
    setPrevUrlSearch(urlSearch)
    if (urlSearch !== searchTerm.trim()) {
      setSearchTerm(urlSearch)
    }
  }

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Push debounced search to URL only when it actually differs and the debounce
  // has caught up with the current input (stale-debounce guard prevents loops on
  // external navigation such as language switches).
  useEffect(() => {
    const trimmed = debouncedSearchTerm.trim()
    if (trimmed !== searchTerm.trim()) return
    if (trimmed === urlSearch) return
    const params = new URLSearchParams(searchParams.toString())
    if (trimmed) params.set('search', trimmed)
    else params.delete('search')
    const nextQuery = params.toString()
    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname
    router.replace(nextUrl, { scroll: false })
  }, [debouncedSearchTerm, searchTerm, pathname, router, searchParams, urlSearch])

  const normalizedNames = useMemo(
    () => names.map((name) => ({
      name,
      _n: {
        arabic: normalizeForSearch(name.arabic),
        transliteration: normalizeForSearch(name.transliteration[locale]),
        meaning: normalizeForSearch(name.meanings[locale]),
      },
    })),
    [names, locale],
  )

  const filteredNames = useMemo(() => {
    const query = normalizeForSearch(debouncedSearchTerm)
    if (!query) return names
    return normalizedNames
      .filter((name) =>
        name._n.arabic.includes(query)
        || name._n.transliteration.includes(query)
        || name._n.meaning.includes(query))
      .map(({ name }) => name)
  }, [debouncedSearchTerm, names, normalizedNames])

  return (
    <section className="space-y-4">
      <div className="sticky top-[4.25rem] z-20 rounded-lg border border-white/10 bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:top-[4.5rem]">
        <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-surface px-3 py-2">
          <span aria-hidden="true" className="text-gold-muted">⌕</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={placeholderByLocale[locale]}
            aria-label={placeholderByLocale[locale]}
            className="w-full bg-transparent text-base text-primary outline-none placeholder:text-muted"
          />
          {searchTerm.trim().length > 0 ? (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="rounded-md p-1 text-muted transition hover:bg-white/10 hover:text-primary focus:outline-none focus:ring-2 focus:ring-gold"
              aria-label={clearByLocale[locale]}
            >
              ✕
            </button>
          ) : null}
        </div>
      </div>

      {filteredNames.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-surface p-6 text-sm text-muted">
          {emptyStateByLocale[locale]} &quot;{debouncedSearchTerm}&quot;.
        </div>
      ) : null}

      {variant === 'dua' ? (
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNames.map((name) => (
            <Link key={name.id} href={getLocalizedNamePath(locale, name.slug)} className="rounded-lg border border-white/10 bg-surface p-4 hover:border-gold/50 focus-ring">
              <span className="block text-right font-arabic text-4xl" lang="ar" dir="rtl">{name.arabic}</span>
              <span className="mt-3 block text-xl font-semibold">{name.transliteration[locale]}</span>
              <span className="mt-3 block text-sm font-semibold text-gold">{name.meanings[locale]}</span>
              <span className="mt-1 block text-sm text-muted">{name.duaUsage[locale]}</span>
            </Link>
          ))}
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2">
          {filteredNames.map((name) => (
            <Link key={name.id} href={getLocalizedNamePath(locale, name.slug)} className="rounded-lg border border-white/10 bg-surface p-5 hover:border-gold/50 focus-ring">
              <span className="block text-right font-arabic text-4xl" lang="ar" dir="rtl">{name.arabic}</span>
              <span className="mt-4 block text-xl font-semibold">{name.transliteration[locale]}</span>
              <span className="mt-1 block text-sm text-gold">{name.meanings[locale]}</span>
              <span className="mt-3 block leading-7 text-muted">{name.reflection?.[locale]}</span>
            </Link>
          ))}
        </section>
      )}
    </section>
  )
}
