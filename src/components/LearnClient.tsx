'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { names } from '@/data/names'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { getLocalizedNamePath, getLocalizedNamesPath } from '@/lib/seo'
import type { Language } from '@/types/language'

export function LearnClient({ embedded = false, locale }: { embedded?: boolean; locale?: Language }) {
  const { language: storedLanguage, progress, actions } = useAppState()
  const language = locale ?? storedLanguage
  const dict = getDict(language)
  const [offset, setOffset] = useState(0)
  const openNames = useMemo(() => names.filter((name) => !progress.learnedIds.includes(name.id)), [progress.learnedIds])
  const current = openNames.length > 0 ? openNames[offset % openNames.length] : undefined

  if (!current) {
    return (
      <section className="mx-auto max-w-2xl rounded-lg border border-gold/20 bg-surface p-8 text-center">
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.learn.eyebrow}</p>
        {embedded ? (
          <h2 className="mt-4 text-3xl font-semibold">{dict.learn.allLearnedTitle}</h2>
        ) : (
          <h1 className="mt-4 text-3xl font-semibold">{dict.learn.allLearnedTitle}</h1>
        )}
        <p className="mt-3 text-muted">{dict.learn.allLearnedBody}</p>
        <Link href={getLocalizedNamesPath(language)} className="btn-primary mt-6">{dict.learn.overview}</Link>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.learn.eyebrow}</p>
        {embedded ? (
          <h2 className="mt-3 text-4xl font-semibold">{dict.learn.title}</h2>
        ) : (
          <h1 className="mt-3 text-4xl font-semibold">{dict.learn.title}</h1>
        )}
        <p className="mt-2 text-muted">{dict.learn.remaining(openNames.length)}</p>
      </section>
      <section className="rounded-lg border border-gold/20 bg-[radial-gradient(circle_at_top,rgba(214,178,94,0.16),rgba(22,22,22,0.98)_60%)] p-6">
        <p className="text-right font-arabic text-7xl leading-tight">{current.arabic}</p>
        <h2 className="mt-8 text-3xl font-semibold">{current.transliteration}</h2>
        <p className="mt-2 text-xl text-gold">{current.meanings[language]}</p>
        <p className="mt-4 leading-7 text-muted">{current.explanations[language]}</p>
      </section>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary" onClick={() => actions.markLearned(current.id, current.slug)}>{dict.learn.markLearned}</button>
        <button className="btn-secondary" onClick={() => setOffset((value) => value + 1)}>{dict.learn.next}</button>
        <Link className="btn-secondary" href={getLocalizedNamePath(language, current.slug)}>{dict.learn.details}</Link>
      </div>
    </div>
  )
}
