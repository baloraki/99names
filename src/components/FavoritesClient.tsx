'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { names } from '@/data/names'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { getLocalizedNamesPath } from '@/lib/seo'
import type { Language } from '@/types/language'
import { NameCard } from './NameCard'

export function FavoritesClient({ locale }: { locale: Language }) {
  const { language: storedLanguage, progress, actions } = useAppState()
  const language = locale ?? storedLanguage
  const dict = getDict(language)

  const favorites = useMemo(
    () => names.filter((name) => progress.favoriteIds.includes(name.id)),
    [progress.favoriteIds],
  )

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.favorites.eyebrow}</p>
        <h1 className="text-3xl font-semibold md:text-5xl">{dict.favorites.title}</h1>
        <p className="max-w-2xl text-base leading-7 text-muted">{dict.favorites.subtitle}</p>
      </section>

      {favorites.length === 0 ? (
        <section className="rounded-lg border border-white/10 bg-surface p-8 text-center">
          <p className="mx-auto max-w-xl text-base leading-7 text-muted">{dict.favorites.empty}</p>
          <Link
            href={getLocalizedNamesPath(language)}
            className="mt-6 inline-flex items-center justify-center rounded-md border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/20 focus-ring"
          >
            {dict.favorites.browseLink}
          </Link>
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((name) => (
            <NameCard
              key={name.id}
              name={name}
              language={language}
              learned={progress.learnedIds.includes(name.id)}
              favorite
              onToggleFavorite={actions.toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
