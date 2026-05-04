'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { names } from '@/data/names'
import { useAppState } from '@/hooks/useAppState'
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition'
import { getDict } from '@/lib/i18n'
import { getLocalizedLearnQuizPath, getLocalizedSeoPath } from '@/lib/seo'
import { ProgressSummary } from './ProgressSummary'

const ALL_NAME_IDS: readonly string[] = names.map((n) => String(n.id))

function getNameOfDay() {
  const start = Date.UTC(2026, 0, 1)
  const day = Math.floor((Date.now() - start) / 86_400_000)
  return names[((day % names.length) + names.length) % names.length]
}

export function HomeClient() {
  const { language, progress } = useAppState()
  const dict = getDict(language)
  const name = getNameOfDay()
  const srs = useSpacedRepetition(ALL_NAME_IDS)
  const quizPath = useMemo(() => getLocalizedLearnQuizPath(language), [language])
  const learnPath = useMemo(() => getLocalizedSeoPath('learn', language), [language])

  const primaryHref = srs.ready && srs.dueIds.length > 0 ? quizPath : learnPath
  const primaryLabel = srs.ready && srs.dueIds.length > 0
    ? dict.home.continueReview(srs.dueIds.length)
    : dict.home.startLearning

  return (
    <div className="space-y-8">
      <section className="grid gap-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:items-center md:py-16">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.home.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-primary md:text-6xl">
            {dict.home.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            {dict.home.subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link className="btn-primary" href="/names">{dict.home.viewAll}</Link>
            <Link className="btn-secondary" href={primaryHref}>{primaryLabel}</Link>
          </div>
        </div>
        <div className="rounded-lg border border-gold/25 hero-gradient-surface p-6">
          <p className="text-sm text-gold">{dict.home.nameOfDay}</p>
          <p className="mt-5 text-right font-arabic text-6xl leading-tight text-primary">{name.arabic}</p>
          <h2 className="mt-6 text-2xl font-semibold">{name.transliteration[language]}</h2>
          <p className="mt-1 text-muted">{name.meanings[language]}</p>
          <Link className="mt-6 inline-flex text-sm font-semibold text-gold hover:text-gold-soft focus-ring rounded" href={`/names/${name.slug}`}>
            {dict.home.openDetails}
          </Link>
        </div>
      </section>
      <div className="max-w-xl">
        <ProgressSummary progress={progress} language={language} />
      </div>
    </div>
  )
}
