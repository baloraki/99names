'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import type { NameEntry } from '@/types/name'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { names } from '@/data/names'

export function NameDetailClient({ name }: { name: NameEntry }) {
  const { language, progress, actions } = useAppState()
  const dict = getDict(language)
  const learned = progress.learnedIds.includes(name.id)
  const favorite = progress.favoriteIds.includes(name.id)
  const next = names[name.id % names.length]

  useEffect(() => {
    actions.setLastViewed(name.slug)
  }, [actions, name.slug])

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <Link href="/names" className="text-sm text-gold hover:text-gold-soft focus-ring rounded">{dict.detail.backToOverview}</Link>
      <section className="rounded-lg border border-gold/20 bg-surface p-6">
        <p className="text-sm text-gold-muted">#{name.id.toString().padStart(2, '0')}</p>
        <p className="mt-6 text-right font-arabic text-7xl leading-tight text-primary">{name.arabic}</p>
        <h1 className="mt-8 text-4xl font-semibold">{name.transliteration[language]}</h1>
        <p className="mt-2 text-muted">{dict.common.pronunciation}: {name.pronunciation[language]}</p>
        <p className="mt-4 text-xl text-gold">{name.meanings[language]}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className={learned ? 'btn-secondary' : 'btn-primary'} onClick={() => learned ? actions.unmarkLearned(name.id) : actions.markLearned(name.id, name.slug)}>
            {learned ? dict.detail.markOpen : dict.detail.markLearned}
          </button>
          <button className="btn-secondary" onClick={() => actions.toggleFavorite(name.id)}>
            {favorite ? dict.detail.removeFavorite : dict.detail.addFavorite}
          </button>
        </div>
      </section>
      <InfoBlock title={dict.common.meaning} body={name.meanings[language]} />
      <InfoBlock title={dict.common.explanation} body={name.explanations[language]} />
      <InfoBlock title={dict.common.dua} body={name.duaUsage[language]} />
      {name.reflection && <InfoBlock title={dict.common.reflection} body={name.reflection[language]} />}
      {name.sourceNote && <p className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-muted">{name.sourceNote[language]}</p>}
      <div className="flex justify-between gap-4">
        <Link className="btn-secondary" href="/names">{dict.detail.back}</Link>
        <Link className="btn-primary" href={`/names/${next.slug}`}>{dict.detail.next}</Link>
      </div>
    </article>
  )
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-lg border border-white/10 bg-surface p-5">
      <h2 className="text-sm uppercase tracking-[0.18em] text-gold">{title}</h2>
      <p className="mt-3 leading-7 text-muted">{body}</p>
    </section>
  )
}
