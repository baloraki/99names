'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { names } from '@/data/names'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { getLocalizedNamePath, getLocalizedNamesPath } from '@/lib/seo'
import type { Language } from '@/types/language'

type Phase = 'question' | 'answer'

export function LearnClient({ embedded = false, locale }: { embedded?: boolean; locale?: Language }) {
  const { language: storedLanguage, progress, actions } = useAppState()
  const language = locale ?? storedLanguage
  const dict = getDict(language)

  const [offset, setOffset] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [sessionCount, setSessionCount] = useState(0)
  const [fading, setFading] = useState(false)

  const openNames = useMemo(
    () => names.filter((name) => !progress.learnedIds.includes(name.id)),
    [progress.learnedIds],
  )
  const current = openNames.length > 0 ? openNames[offset % openNames.length] : undefined
  const learnedCount = progress.learnedIds.length
  const isFavorite = current ? progress.favoriteIds.includes(current.id) : false
  const progressPercent = Math.round((learnedCount / 99) * 100)

  const transition = useCallback((fn: () => void) => {
    setFading(true)
    setTimeout(() => {
      fn()
      setFading(false)
    }, 180)
  }, [])

  const handleReveal = useCallback(() => {
    setPhase('answer')
  }, [])

  const handleNext = useCallback(() => {
    transition(() => {
      setOffset((v) => v + 1)
      setPhase('question')
    })
  }, [transition])

  const handleMarkLearned = useCallback(() => {
    if (!current) return
    actions.markLearned(current.id, current.slug)
    setSessionCount((v) => v + 1)
    transition(() => {
      setPhase('question')
    })
  }, [current, actions, transition])

  const handleFavorite = useCallback(() => {
    if (!current) return
    actions.toggleFavorite(current.id)
  }, [current, actions])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'BUTTON' || tag === 'A') return
      if (e.metaKey || e.ctrlKey || e.altKey) return

      if (e.key === ' ') {
        e.preventDefault()
        if (phase === 'question') handleReveal()
        else handleNext()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (phase === 'question') handleReveal()
      } else if (e.key === 'l' || e.key === 'L') {
        if (phase === 'answer') handleMarkLearned()
      } else if (e.key === 'n' || e.key === 'N') {
        handleNext()
      } else if (e.key === 'f' || e.key === 'F') {
        handleFavorite()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, handleReveal, handleNext, handleMarkLearned, handleFavorite])

  if (!current) {
    return (
      <section className="mx-auto max-w-2xl rounded-lg border border-gold/20 bg-surface p-8 text-center">
        <div className="text-4xl">✓</div>
        <p className="mt-3 text-sm uppercase tracking-[0.22em] text-gold">{dict.learn.eyebrow}</p>
        {embedded ? (
          <h2 className="mt-4 text-3xl font-semibold">{dict.learn.allLearnedTitle}</h2>
        ) : (
          <h1 className="mt-4 text-3xl font-semibold">{dict.learn.allLearnedTitle}</h1>
        )}
        <p className="mt-3 text-muted">{dict.learn.allLearnedBody}</p>
        <Link href={getLocalizedNamesPath(language)} className="btn-primary mt-6 inline-flex">
          {dict.learn.overview}
        </Link>
      </section>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {/* Header */}
      <section>
        <p className="text-sm uppercase tracking-[0.22em] text-gold">{dict.learn.eyebrow}</p>
        {embedded ? (
          <h2 className="mt-2 text-3xl font-semibold">{dict.learn.title}</h2>
        ) : (
          <h1 className="mt-2 text-3xl font-semibold">{dict.learn.title}</h1>
        )}
      </section>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted">{dict.learn.overallLearned(learnedCount, 99)}</span>
          <div className="flex items-center gap-3">
            {sessionCount > 0 && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                {dict.learn.sessionLearned(sessionCount)}
              </span>
            )}
            <span className="text-muted">{dict.learn.remaining(openNames.length)}</span>
          </div>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-surface-soft"
          role="progressbar"
          aria-valuenow={learnedCount}
          aria-valuemin={0}
          aria-valuemax={99}
          aria-label={dict.learn.overallLearned(learnedCount, 99)}
        >
          <div
            className="h-full rounded-full bg-gold transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <section
        key={current.id}
        className="rounded-lg border border-gold/20 bg-[radial-gradient(circle_at_top,rgba(214,178,94,0.14),rgba(22,22,22,0.99)_60%)] p-6 transition-opacity duration-150"
        style={{ opacity: fading ? 0 : 1 }}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Card header: number + favorite */}
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded bg-surface-soft px-2 py-0.5 text-xs text-gold-muted tabular-nums">
            #{current.id.toString().padStart(2, '0')} / 99
          </span>
          <button
            className={`focus-ring rounded p-1.5 text-2xl leading-none transition-all duration-150 ${
              isFavorite ? 'text-gold scale-110' : 'text-muted/50 hover:text-gold/70'
            }`}
            onClick={handleFavorite}
            aria-label={isFavorite ? dict.common.removeFavorite : dict.common.favorite}
            aria-pressed={isFavorite}
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>

        {/* Arabic + pronunciation */}
        <p
          className="text-right font-arabic text-7xl leading-tight tracking-wide"
          lang="ar"
          dir="rtl"
        >
          {current.arabic}
        </p>
        <p className="mt-1.5 text-right text-sm text-gold-muted tracking-widest">
          {current.pronunciation}
        </p>

        {phase === 'question' ? (
          /* ── Question phase ── */
          <div className="mt-10 space-y-4">
            <p className="text-center text-sm italic text-muted/70">{dict.learn.recallPrompt}</p>
            <button className="btn-primary w-full text-base" onClick={handleReveal}>
              {dict.learn.showMeaning}
            </button>
          </div>
        ) : (
          /* ── Answer phase ── */
          <div className="mt-6 space-y-5">
            {/* Meaning block */}
            <div>
              <p className="text-2xl font-semibold">{current.transliteration}</p>
              <p className="mt-1.5 text-lg font-medium text-gold">{current.meanings[language]}</p>
              <p className="mt-3 leading-7 text-muted text-sm">{current.explanations[language]}</p>
            </div>

            {/* Expandable: Dua */}
            {current.duaUsage?.[language] && (
              <details className="rounded-lg border border-white/10 bg-surface-soft">
                <summary className="flex cursor-pointer select-none items-center gap-2 p-3.5 text-sm font-semibold text-gold focus-ring rounded-lg list-none [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true">🤲</span>
                  {dict.common.dua}
                  <span className="ml-auto text-muted/50 text-xs font-normal transition-transform details-chevron">▾</span>
                </summary>
                <p className="px-4 pb-4 pt-0 text-sm leading-7 text-muted">
                  {current.duaUsage[language]}
                </p>
              </details>
            )}

            {/* Expandable: Reflection */}
            {current.reflection?.[language] && (
              <details className="rounded-lg border border-white/10 bg-surface-soft">
                <summary className="flex cursor-pointer select-none items-center gap-2 p-3.5 text-sm font-semibold text-gold-soft focus-ring rounded-lg list-none [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true">💭</span>
                  {dict.common.reflection}
                  <span className="ml-auto text-muted/50 text-xs font-normal">▾</span>
                </summary>
                <p className="px-4 pb-4 pt-0 text-sm leading-7 text-muted">
                  {current.reflection[language]}
                </p>
              </details>
            )}
          </div>
        )}
      </section>

      {/* Action buttons */}
      {phase === 'answer' && (
        <div className="flex flex-col gap-3 sm:flex-row" style={{ opacity: fading ? 0 : 1 }}>
          <button className="btn-primary flex-1" onClick={handleMarkLearned}>
            {dict.learn.markLearned}
          </button>
          <button className="btn-secondary" onClick={handleNext}>
            {dict.learn.next}
          </button>
          <Link className="btn-secondary" href={getLocalizedNamePath(language, current.slug)}>
            {dict.learn.details}
          </Link>
        </div>
      )}

      {/* Keyboard hint */}
      <p className="text-center text-xs text-muted/40 select-none" aria-hidden="true">
        {dict.learn.keyboard}
      </p>
    </div>
  )
}
