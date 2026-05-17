'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { names } from '@/data/names'
import { useAppState } from '@/hooks/useAppState'
import { filterNames } from '@/lib/filters'
import { getDict } from '@/lib/i18n'
import { searchNames } from '@/lib/search'
import { getLocalizedLearnQuizPath } from '@/lib/seo'
import { NameCard } from './NameCard'
import { ProgressSummary } from './ProgressSummary'

type FilterMode = 'all' | 'learned' | 'favorites' | 'open'

export function NamesExplorer() {
  const { language, progress, actions } = useAppState()
  const dict = getDict(language)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<FilterMode>('all')
  const quizPath = getLocalizedLearnQuizPath(language)

  const filtered = useMemo(() => {
    const searched = searchNames(names, query, language)
    return filterNames(searched, {
      learnedIds: progress.learnedIds,
      favoriteIds: progress.favoriteIds,
      showLearned: filter === 'learned',
      showFavorites: filter === 'favorites',
      showUnlearned: filter === 'open',
    })
  }, [filter, language, progress.favoriteIds, progress.learnedIds, query])

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-[1fr_360px] md:items-end">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.names.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold md:text-5xl">{dict.names.title}</h1>
        </div>
        <ProgressSummary progress={progress} compact language={language} />
      </section>
      <section className="rounded-lg border border-white/10 bg-surface p-4">
        <label className="block text-sm text-muted" htmlFor="name-search">{dict.names.search}</label>
        <input
          id="name-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="mt-2 w-full rounded-md border border-white/10 bg-background-soft px-4 py-3 text-primary outline-none focus:border-gold focus:ring-2 focus:ring-gold/40"
          placeholder={dict.names.searchPlaceholder}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {([
            ['all', dict.names.filterAll],
            ['learned', dict.names.filterLearned],
            ['favorites', dict.names.filterFavorites],
            ['open', dict.names.filterOpen],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              className={filter === value ? 'chip chip-active' : 'chip'}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      {filtered.length === 0 ? (
        <section className="rounded-lg border border-white/10 bg-surface p-8 text-center text-muted">
          {dict.names.noResults}
        </section>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((name) => (
            <NameCard
              key={name.id}
              name={name}
              language={language}
              learned={progress.learnedIds.includes(name.id)}
              favorite={progress.favoriteIds.includes(name.id)}
              onToggleFavorite={actions.toggleFavorite}
            />
          ))}
        </div>
      )}
      <section className="flex flex-col items-start justify-between gap-4 rounded-lg border border-gold/20 bg-surface p-6 sm:flex-row sm:items-center">
        <p className="text-sm leading-6 text-muted">{dict.names.quizCta}</p>
        <Link
          href={quizPath}
          className="shrink-0 rounded-md border border-gold/40 px-4 py-2 text-sm font-semibold text-gold transition hover:border-gold hover:bg-gold/10 focus-ring"
        >
          {dict.names.quizCtaLink}
        </Link>
      </section>
    </div>
  )
}
