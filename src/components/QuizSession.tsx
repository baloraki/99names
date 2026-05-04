'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Flashcard, type FlashcardLabels } from '@/components/Flashcard'
import { names } from '@/data/names'
import { useSpacedRepetition } from '@/hooks/useSpacedRepetition'
import { getLocalizedNamesPath, getLocalizedSeoPath } from '@/lib/seo'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'
import type { PromptType, ReviewGrade, SrsState } from '@/types/srs'

type Copy = {
  eyebrow: string
  title: string
  intro: string
  progress: (current: number, total: number) => string
  emptyTitle: string
  emptyBody: string
  emptySubtle: string
  reviewStats: (total: number, learned: number) => string
  promptHeading: string
  promptRandom: string
  promptMeaningOption: string
  promptTransliterationOption: string
  resetLabel: string
  resetConfirm: string
  browseLink: string
  learnLink: string
  card: FlashcardLabels
}

const copy: Record<Language, Copy> = {
  en: {
    eyebrow: 'Daily review',
    title: 'Spaced repetition quiz',
    intro:
      'Recall first, reveal second. Rate each card honestly so the schedule can space your reviews across days, not minutes.',
    progress: (current, total) => `Card ${current} of ${total} due today`,
    emptyTitle: 'All caught up for today!',
    emptyBody: 'No cards are due right now. Come back later or browse the names.',
    emptySubtle: 'Reviews resurface gradually based on how well you recalled each name.',
    reviewStats: (total, learned) => `${learned} of ${total} names tracked`,
    promptHeading: 'Prompt side',
    promptRandom: 'Random',
    promptMeaningOption: 'Meaning',
    promptTransliterationOption: 'Transliteration',
    resetLabel: 'Reset schedule',
    resetConfirm: 'Reset all spaced-repetition data?',
    browseLink: 'Browse all names',
    learnLink: 'Open learning mode',
    card: {
      promptMeaning: 'Recall from meaning',
      promptTransliteration: 'Recall from transliteration',
      recallHint: 'Picture the Arabic name and meaning before revealing.',
      reveal: 'Reveal',
      meaning: 'Meaning',
      pronunciation: 'Pronunciation',
      explanation: 'Explanation',
      hard: 'Hard',
      good: 'Good',
      easy: 'Easy',
      hardHint: 'Reset interval',
      goodHint: 'Steady progress',
      easyHint: 'Big interval bump',
      assessmentTitle: 'How did that feel?',
    },
  },
  de: {
    eyebrow: 'Tägliche Wiederholung',
    title: 'Quiz mit Spaced Repetition',
    intro:
      'Erst erinnern, dann aufdecken. Bewerte jede Karte ehrlich, damit der Plan deine Wiederholungen über Tage verteilen kann.',
    progress: (current, total) => `Karte ${current} von ${total} fällig`,
    emptyTitle: 'Heute alles erledigt!',
    emptyBody: 'Aktuell sind keine Karten fällig. Schau später wieder vorbei oder stöbere durch die Namen.',
    emptySubtle: 'Die Wiederholungen tauchen schrittweise wieder auf, je nachdem wie gut du dich erinnert hast.',
    reviewStats: (total, learned) => `${learned} von ${total} Namen gespeichert`,
    promptHeading: 'Vorderseite',
    promptRandom: 'Zufällig',
    promptMeaningOption: 'Bedeutung',
    promptTransliterationOption: 'Transliteration',
    resetLabel: 'Plan zurücksetzen',
    resetConfirm: 'Alle Wiederholungsdaten zurücksetzen?',
    browseLink: 'Alle Namen ansehen',
    learnLink: 'Lernmodus öffnen',
    card: {
      promptMeaning: 'Erinnern aus Bedeutung',
      promptTransliteration: 'Erinnern aus Transliteration',
      recallHint: 'Stell dir den arabischen Namen und die Bedeutung vor, bevor du aufdeckst.',
      reveal: 'Aufdecken',
      meaning: 'Bedeutung',
      pronunciation: 'Aussprache',
      explanation: 'Erklärung',
      hard: 'Schwer',
      good: 'Gut',
      easy: 'Leicht',
      hardHint: 'Intervall zurücksetzen',
      goodHint: 'Gleichmäßiger Fortschritt',
      easyHint: 'Größerer Sprung',
      assessmentTitle: 'Wie war das?',
    },
  },
  tr: {
    eyebrow: 'Günlük tekrar',
    title: 'Aralıklı tekrar quiz’i',
    intro:
      'Önce hatırla, sonra aç. Her kartı dürüst değerlendir ki plan tekrarları günlere yayabilsin.',
    progress: (current, total) => `Bugünkü ${total} karttan ${current}.`,
    emptyTitle: 'Bugün için her şey tamam!',
    emptyBody: 'Şu anda tekrarı gelen kart yok. Sonra tekrar uğra ya da isimlere göz at.',
    emptySubtle: 'Hatırlama performansına göre tekrarlar zamanla yeniden gelir.',
    reviewStats: (total, learned) => `${total} isimden ${learned} tanesi takipte`,
    promptHeading: 'Soru tarafı',
    promptRandom: 'Rastgele',
    promptMeaningOption: 'Anlam',
    promptTransliterationOption: 'Transliterasyon',
    resetLabel: 'Planı sıfırla',
    resetConfirm: 'Tüm aralıklı tekrar verileri sıfırlansın mı?',
    browseLink: 'Tüm isimlere göz at',
    learnLink: 'Öğrenme modunu aç',
    card: {
      promptMeaning: 'Anlamdan hatırla',
      promptTransliteration: 'Transliterasyondan hatırla',
      recallHint: 'Açmadan önce Arapça yazımı ve anlamı zihinde canlandır.',
      reveal: 'Göster',
      meaning: 'Anlam',
      pronunciation: 'Telaffuz',
      explanation: 'Açıklama',
      hard: 'Zor',
      good: 'İyi',
      easy: 'Kolay',
      hardHint: 'Aralığı sıfırla',
      goodHint: 'Düzenli ilerleme',
      easyHint: 'Daha büyük aralık',
      assessmentTitle: 'Nasıl gitti?',
    },
  },
}

const ALL_NAME_IDS: readonly string[] = names.map((name) => String(name.id))
const NAME_BY_ID: Record<string, NameEntry> = Object.fromEntries(names.map((name) => [String(name.id), name]))

export function QuizSession({ locale }: { locale: Language }) {
  const t = copy[locale]
  const srs = useSpacedRepetition(ALL_NAME_IDS)
  const [sessionQueue, setSessionQueue] = useState<readonly string[]>([])
  const [completed, setCompleted] = useState(0)

  useEffect(() => {
    if (!srs.ready) return
    if (sessionQueue.length > 0 || srs.dueIds.length === 0) return
    queueMicrotask(() => setSessionQueue(srs.dueIds))
  }, [srs.ready, srs.dueIds, sessionQueue.length])

  const currentId = sessionQueue[0]
  const currentName = currentId ? NAME_BY_ID[currentId] : undefined

  const promptForCurrent: PromptType = useMemo(() => {
    if (!currentId) return 'meaning'
    if (srs.state.promptPreference !== 'random') return srs.state.promptPreference
    const hash = Number(currentId)
    return Number.isFinite(hash) && hash % 2 === 0 ? 'meaning' : 'transliteration'
  }, [currentId, srs.state.promptPreference])

  const total = sessionQueue.length + completed
  const currentNumber = Math.min(completed + 1, total || 1)

  const trackedCount = useMemo(() => Object.keys(srs.state.cards).length, [srs.state.cards])

  if (!srs.ready) {
    return (
      <div className="rounded-2xl border border-white/10 bg-surface p-6 text-sm text-muted">
        <p>{t.intro}</p>
      </div>
    )
  }

  if (!currentName) {
    return (
      <EmptyState
        copy={t}
        locale={locale}
        trackedCount={trackedCount}
        totalNames={names.length}
        promptPreference={srs.state.promptPreference}
        onPromptPreferenceChange={srs.setPromptPreference}
        onReset={() => {
          if (window.confirm(t.resetConfirm)) {
            srs.reset()
            setSessionQueue([])
            setCompleted(0)
          }
        }}
      />
    )
  }

  function handleGrade(grade: ReviewGrade) {
    if (!currentId) return
    srs.review(currentId, grade)
    setSessionQueue((current) => current.slice(1))
    setCompleted((value) => value + 1)
  }

  return (
    <section className="space-y-5" aria-live="polite">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gold">{t.eyebrow}</p>
          <h1 className="text-3xl font-semibold leading-tight text-primary md:text-4xl">{t.title}</h1>
        </div>
        <p className="text-sm font-medium text-muted">{t.progress(currentNumber, total)}</p>
      </header>

      <SessionProgressBar current={completed} total={total} />

      <Flashcard
        key={currentId}
        name={currentName}
        language={locale}
        promptType={promptForCurrent}
        onGrade={handleGrade}
        labels={t.card}
      />

      <PromptPreferenceControl
        copy={t}
        value={srs.state.promptPreference}
        onChange={srs.setPromptPreference}
      />

      <p className="text-xs text-muted">{t.intro}</p>
    </section>
  )
}

function SessionProgressBar({ current, total }: { current: number; total: number }) {
  const percent = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-white/5"
    >
      <div className="h-full bg-gold transition-all" style={{ width: `${percent}%` }} />
    </div>
  )
}

function PromptPreferenceControl({
  copy: t,
  value,
  onChange,
}: {
  copy: Copy
  value: SrsState['promptPreference']
  onChange: (value: SrsState['promptPreference']) => void
}) {
  const options: Array<{ id: SrsState['promptPreference']; label: string }> = [
    { id: 'random', label: t.promptRandom },
    { id: 'meaning', label: t.promptMeaningOption },
    { id: 'transliteration', label: t.promptTransliterationOption },
  ]

  return (
    <fieldset className="rounded-xl border border-white/10 bg-surface-soft p-4">
      <legend className="px-2 text-xs uppercase tracking-[0.18em] text-gold-muted">{t.promptHeading}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={
                active
                  ? 'rounded-full border border-gold/55 bg-gold/15 px-3 py-1.5 text-sm font-semibold text-gold-soft focus-ring'
                  : 'rounded-full border border-white/10 px-3 py-1.5 text-sm text-muted hover:border-gold/40 hover:text-primary focus-ring'
              }
              aria-pressed={active}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

function EmptyState({
  copy: t,
  locale,
  trackedCount,
  totalNames,
  promptPreference,
  onPromptPreferenceChange,
  onReset,
}: {
  copy: Copy
  locale: Language
  trackedCount: number
  totalNames: number
  promptPreference: SrsState['promptPreference']
  onPromptPreferenceChange: (value: SrsState['promptPreference']) => void
  onReset: () => void
}) {
  return (
    <section className="space-y-5">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{t.eyebrow}</p>
        <h1 className="text-3xl font-semibold leading-tight text-primary md:text-4xl">{t.title}</h1>
      </header>
      <article className="space-y-3 rounded-2xl border border-gold/30 bg-surface p-6 text-center">
        <p className="text-2xl font-semibold text-gold-soft">{t.emptyTitle}</p>
        <p className="text-sm text-muted">{t.emptyBody}</p>
        <p className="text-xs text-muted">{t.emptySubtle}</p>
        <p className="text-xs text-muted">{t.reviewStats(totalNames, trackedCount)}</p>
      </article>
      <PromptPreferenceControl copy={t} value={promptPreference} onChange={onPromptPreferenceChange} />
      <div className="flex flex-wrap gap-3">
        <Link className="btn-primary focus-ring" href={getLocalizedNamesPath(locale)}>
          {t.browseLink}
        </Link>
        <Link className="btn-secondary focus-ring" href={getLocalizedSeoPath('learn', locale)}>
          {t.learnLink}
        </Link>
        <button type="button" onClick={onReset} className="btn-secondary focus-ring">
          {t.resetLabel}
        </button>
      </div>
    </section>
  )
}
