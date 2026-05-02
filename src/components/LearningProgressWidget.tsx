'use client'

import Link from 'next/link'
import { useAppState } from '@/hooks/useAppState'
import { getLocalizedSeoPath } from '@/lib/seo'
import type { Language } from '@/types/language'
import { ProgressSummary } from './ProgressSummary'

const labels = {
  en: {
    eyebrow: 'Learning progress',
    title: 'Your learning progress',
    favorites: 'Favorites',
    lastViewed: 'Last viewed',
    none: 'No name opened yet',
    continue: 'Continue learning',
    openLast: 'Open last name',
  },
  de: {
    eyebrow: 'Lernfortschritt',
    title: 'Dein Lernfortschritt',
    favorites: 'Favoriten',
    lastViewed: 'Zuletzt angesehen',
    none: 'Noch kein Name geöffnet',
    continue: 'Weiterlernen',
    openLast: 'Letzten Namen öffnen',
  },
  tr: {
    eyebrow: 'Öğrenme ilerlemesi',
    title: 'Öğrenme ilerlemen',
    favorites: 'Favoriler',
    lastViewed: 'Son görüntülenen',
    none: 'Henüz isim açılmadı',
    continue: 'Öğrenmeye devam et',
    openLast: 'Son ismi aç',
  },
} as const

export function LearningProgressWidget({ locale, compact = false }: { locale: Language; compact?: boolean }) {
  const { progress } = useAppState()
  const text = labels[locale]
  return (
    <section className="rounded-lg border border-gold/20 bg-surface p-5" aria-labelledby={`learning-progress-${locale}`}>
      <div className="grid gap-5 md:grid-cols-[1fr_0.95fr] md:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-gold">{text.eyebrow}</p>
          <h2 id={`learning-progress-${locale}`} className="mt-2 text-2xl font-semibold">
            {text.title}
          </h2>
          {!compact && (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" href={getLocalizedSeoPath('learn', locale)}>{text.continue}</Link>
              </div>
          )}
        </div>
        <ProgressSummary progress={progress} compact={compact} language={locale} />
      </div>
    </section>
  )
}
