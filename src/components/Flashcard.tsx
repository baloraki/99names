'use client'

import { useState } from 'react'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'
import type { PromptType, ReviewGrade } from '@/types/srs'

type Labels = {
  promptMeaning: string
  promptTransliteration: string
  recallHint: string
  reveal: string
  meaning: string
  pronunciation: string
  explanation: string
  hard: string
  good: string
  easy: string
  hardHint: string
  goodHint: string
  easyHint: string
  assessmentTitle: string
}

type Props = {
  name: NameEntry
  language: Language
  promptType: PromptType
  onGrade: (grade: ReviewGrade) => void
  labels: Labels
}

export function Flashcard({
  name,
  language,
  promptType,
  onGrade,
  labels,
}: Props) {
  const [revealed, setRevealed] = useState(false)
  const onReveal = () => setRevealed(true)
  const promptValue = promptType === 'meaning' ? name.meanings[language] : name.transliteration[language]
  const promptLabel = promptType === 'meaning' ? labels.promptMeaning : labels.promptTransliteration

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-surface p-6 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{promptLabel}</p>
        <p className="text-2xl font-semibold leading-snug text-primary md:text-3xl">{promptValue}</p>
      </header>

      {!revealed ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-sm text-muted">{labels.recallHint}</p>
          <button
            type="button"
            onClick={onReveal}
            className="btn-primary focus-ring w-full sm:w-auto"
            aria-label={labels.reveal}
          >
            {labels.reveal}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl bg-background-soft px-5 py-6 text-center">
            <p className="font-arabic text-5xl leading-tight text-primary md:text-6xl" lang="ar" dir="rtl">
              {name.arabic}
            </p>
            <p className="mt-3 text-lg font-semibold text-primary">{name.transliteration[language]}</p>
            <p className="mt-1 text-sm text-gold">{name.meanings[language]}</p>
            <p className="mt-1 text-xs text-muted">
              <span className="font-medium text-muted/80">{labels.pronunciation}:</span> {name.pronunciation[language]}
            </p>
          </div>
          <div className="space-y-2 text-sm leading-7 text-muted">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{labels.explanation}</p>
            <p>{name.explanations[language]}</p>
          </div>

          <div className="space-y-3 border-t border-white/10 pt-4">
            <p className="text-xs uppercase tracking-[0.18em] text-gold-muted">{labels.assessmentTitle}</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <GradeButton
                grade="hard"
                label={labels.hard}
                hint={labels.hardHint}
                onClick={() => onGrade('hard')}
              />
              <GradeButton
                grade="good"
                label={labels.good}
                hint={labels.goodHint}
                onClick={() => onGrade('good')}
              />
              <GradeButton
                grade="easy"
                label={labels.easy}
                hint={labels.easyHint}
                onClick={() => onGrade('easy')}
              />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

function GradeButton({
  grade,
  label,
  hint,
  onClick,
}: {
  grade: ReviewGrade
  label: string
  hint: string
  onClick: () => void
}) {
  const className =
    grade === 'hard'
      ? 'btn-danger focus-ring flex flex-col items-center gap-1 py-3'
      : grade === 'easy'
        ? 'btn-primary focus-ring flex flex-col items-center gap-1 py-3'
        : 'btn-secondary focus-ring flex flex-col items-center gap-1 py-3'

  return (
    <button type="button" onClick={onClick} className={className} aria-label={`${label}: ${hint}`}>
      <span className="text-base font-semibold">{label}</span>
      <span className="text-xs font-normal opacity-80">{hint}</span>
    </button>
  )
}

export type { Labels as FlashcardLabels }
