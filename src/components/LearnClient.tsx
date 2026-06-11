'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { names } from '@/data/names'
import { useAppState } from '@/hooks/useAppState'
import { getDict } from '@/lib/i18n'
import { getLocalizedNamePath, getLocalizedNamesPath } from '@/lib/seo'
import { currentStreak } from '@/lib/streak'
import type { Language } from '@/types/language'
import type { NameEntry } from '@/types/name'

type Phase = 'question' | 'answer'
type DragDir = null | 'left' | 'right' | 'up'

const SWIPE_THRESHOLD = 80
// Set to true to re-enable the audio feature
const AUDIO_ENABLED = false

function seededShuffle<T>(input: T[], seed: number): T[] {
  const arr = [...input]
  let s = seed || 1
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280
    const j = Math.floor((s / 233280) * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function LearnClient({ embedded = false, locale }: { embedded?: boolean; locale?: Language }) {
  const { language: storedLanguage, progress, learnState, actions } = useAppState()
  const language = locale ?? storedLanguage
  const dict = getDict(language)

  const [offset, setOffset] = useState(0)
  const [phase, setPhase] = useState<Phase>('question')
  const [sessionCount, setSessionCount] = useState(0)
  const [fading, setFading] = useState(false)
  const [reversed, setReversed] = useState(false)
  const [drag, setDrag] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false })
  const [shuffleSeed, setShuffleSeed] = useState(() => Math.floor(Math.random() * 1_000_000) + 1)
  const [audioState, setAudioState] = useState<'idle' | 'playing' | 'unsupported'>('idle')
  const cardRef = useRef<HTMLDivElement | null>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  const baseQueue: NameEntry[] = useMemo(() => {
    const open = names.filter((name) => !progress.learnedIds.includes(name.id))
    if (!learnState.shuffle) return open
    return seededShuffle(open, shuffleSeed)
  }, [progress.learnedIds, learnState.shuffle, shuffleSeed])

  const repeatQueue: NameEntry[] = useMemo(() => {
    return learnState.repeatIds
      .map((id) => names.find((n) => n.id === id))
      .filter((n): n is NameEntry => Boolean(n) && !progress.learnedIds.includes(n!.id))
  }, [learnState.repeatIds, progress.learnedIds])

  const queue: NameEntry[] = useMemo(() => {
    if (repeatQueue.length === 0) return baseQueue
    const repeatIds = new Set(repeatQueue.map((n) => n.id))
    const filteredBase = baseQueue.filter((n) => !repeatIds.has(n.id))
    return [...repeatQueue, ...filteredBase]
  }, [baseQueue, repeatQueue])

  const current = queue.length > 0 ? queue[offset % queue.length] : undefined
  const nextThree = useMemo(() => {
    if (queue.length <= 1) return []
    const out: NameEntry[] = []
    for (let i = 1; i <= 3 && i < queue.length; i++) {
      out.push(queue[(offset + i) % queue.length])
    }
    return out
  }, [queue, offset])

  const learnedCount = progress.learnedIds.length
  const isFavorite = current ? progress.favoriteIds.includes(current.id) : false
  const progressPercent = Math.round((learnedCount / 99) * 100)
  const streak = currentStreak(learnState)

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

  const handleSkip = useCallback(() => {
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

  const handleRepeat = useCallback(() => {
    if (!current) return
    actions.queueRepeat(current.id)
    transition(() => {
      setOffset((v) => v + 1)
      setPhase('question')
    })
  }, [current, actions, transition])

  const handleFavorite = useCallback(() => {
    if (!current) return
    actions.toggleFavorite(current.id)
  }, [current, actions])

  const handleFlipSide = useCallback(() => {
    transition(() => {
      setReversed((v) => !v)
      setPhase('question')
    })
  }, [transition])

  const handleToggleShuffle = useCallback(() => {
    actions.toggleShuffle()
    setShuffleSeed(Math.floor(Math.random() * 1_000_000) + 1)
    setOffset(0)
  }, [actions])

  const handleAudio = useCallback(() => {
    if (!current) return
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioState('unsupported')
      return
    }
    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(current.arabic)
      utterance.lang = 'ar-SA'
      utterance.rate = 0.85
      utterance.onstart = () => setAudioState('playing')
      utterance.onend = () => setAudioState('idle')
      utterance.onerror = () => setAudioState('idle')
      window.speechSynthesis.speak(utterance)
    } catch {
      setAudioState('idle')
    }
  }, [current])

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (learnState.mode !== 'card') return

      if (e.key === ' ') {
        e.preventDefault()
        if (phase === 'question') handleReveal()
        else handleSkip()
      } else if (e.key === 'Enter') {
        if (tag === 'BUTTON' || tag === 'A') return
        e.preventDefault()
        if (phase === 'question') handleReveal()
      } else if (e.key === 'l' || e.key === 'L') {
        handleMarkLearned()
      } else if (e.key === 'n' || e.key === 'N') {
        handleSkip()
      } else if (e.key === 'r' || e.key === 'R') {
        handleRepeat()
      } else if (e.key === 'f' || e.key === 'F') {
        handleFavorite()
      } else if ((e.key === 'a' || e.key === 'A') && AUDIO_ENABLED) {
        handleAudio()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [
    phase,
    learnState.mode,
    handleReveal,
    handleSkip,
    handleMarkLearned,
    handleRepeat,
    handleFavorite,
    handleAudio,
  ])

  const dragDirection: DragDir = useMemo(() => {
    if (!drag.active) return null
    if (Math.abs(drag.y) > Math.abs(drag.x) && drag.y < -SWIPE_THRESHOLD / 2) return 'up'
    if (drag.x > SWIPE_THRESHOLD / 2) return 'right'
    if (drag.x < -SWIPE_THRESHOLD / 2) return 'left'
    return null
  }, [drag])

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    const target = e.target as HTMLElement
    if (target.closest('button, a, details, summary, [data-no-swipe]')) return
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    setDrag({ x: 0, y: 0, active: true })
    cardRef.current?.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    setDrag({ x: dx, y: dy, active: true })
  }

  const finishDrag = useCallback(
    (commit: boolean) => {
      if (!drag.active) return
      if (commit) {
        if (Math.abs(drag.y) > Math.abs(drag.x) && drag.y < -SWIPE_THRESHOLD) {
          handleRepeat()
        } else if (drag.x > SWIPE_THRESHOLD) {
          handleMarkLearned()
        } else if (drag.x < -SWIPE_THRESHOLD) {
          handleSkip()
        }
      }
      dragStartRef.current = null
      setDrag({ x: 0, y: 0, active: false })
    },
    [drag, handleMarkLearned, handleRepeat, handleSkip],
  )

  const onPointerUp = (e: React.PointerEvent) => {
    cardRef.current?.releasePointerCapture?.(e.pointerId)
    finishDrag(true)
  }

  const onPointerCancel = () => {
    finishDrag(false)
  }

  if (!current && learnState.mode === 'card') {
    return (
      <CompletedScreen
        embedded={embedded}
        dict={dict}
        language={language}
        onRestart={() => {
          actions.resetProgress()
          setSessionCount(0)
          setOffset(0)
          setPhase('question')
        }}
      />
    )
  }

  return (
    <div id="learn-now" className="mx-auto max-w-2xl scroll-mt-28 space-y-5">
      {/* Header with mode toggle + streak */}
      <section className="flex items-center justify-between gap-3">
        <ModeToggle current={learnState.mode} onChange={(m) => actions.setMode(m)} dict={dict} />
        <StreakBadge count={streak} dict={dict} />
      </section>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm tabular-nums">
          <span className="text-muted">{dict.learn.overallLearned(learnedCount, 99)}</span>
          <div className="flex items-center gap-3">
            {sessionCount > 0 && (
              <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold">
                {dict.learn.sessionLearned(sessionCount)}
              </span>
            )}
            <span className="text-gold">{progressPercent}%</span>
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

      {learnState.mode === 'card' && current ? (
        <CardMode
          dict={dict}
          language={language}
          name={current}
          phase={phase}
          fading={fading}
          drag={drag}
          dragDirection={dragDirection}
          reversed={reversed}
          isFavorite={isFavorite}
          shuffleOn={learnState.shuffle}
          audioState={AUDIO_ENABLED ? audioState : 'unsupported'}
          cardRef={cardRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onReveal={handleReveal}
          onFlipSide={handleFlipSide}
          onToggleShuffle={handleToggleShuffle}
          onFavorite={handleFavorite}
          onAudio={handleAudio}
          onSkip={handleSkip}
          onMarkLearned={handleMarkLearned}
          onRepeat={handleRepeat}
          nextThree={nextThree}
        />
      ) : (
        <BrowseMode
          dict={dict}
          language={language}
          progress={progress}
          repeatIds={learnState.repeatIds}
          actions={actions}
        />
      )}

      {/* Keyboard hint - only in card mode */}
      {learnState.mode === 'card' && (
        <p className="text-center text-xs text-muted/40 select-none">
          {dict.learn.keyboard}
        </p>
      )}
    </div>
  )
}

function ModeToggle({
  current,
  onChange,
  dict,
}: {
  current: 'card' | 'list'
  onChange: (next: 'card' | 'list') => void
  dict: ReturnType<typeof getDict>
}) {
  return (
    <div role="tablist" aria-label={dict.learn.eyebrow} className="inline-flex rounded-lg border border-white/10 bg-surface p-1 text-sm">
      <button
        type="button"
        role="tab"
        aria-selected={current === 'card'}
        onClick={() => onChange('card')}
        className={
          current === 'card'
            ? 'rounded-md border border-gold/55 bg-gold/12 px-3 py-1.5 font-semibold text-gold'
            : 'rounded-md px-3 py-1.5 text-muted hover:text-gold/80'
        }
      >
        ◂ {dict.learn.modeCard}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={current === 'list'}
        onClick={() => onChange('list')}
        className={
          current === 'list'
            ? 'rounded-md border border-gold/55 bg-gold/12 px-3 py-1.5 font-semibold text-gold'
            : 'rounded-md px-3 py-1.5 text-muted hover:text-gold/80'
        }
      >
        ◇ {dict.learn.modeList}
      </button>
    </div>
  )
}

function StreakBadge({ count, dict }: { count: number; dict: ReturnType<typeof getDict> }) {
  if (count <= 0) return <span className="sr-only" aria-hidden="true" />
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-300"
      title={dict.learn.streakLabel}
      aria-label={`${dict.learn.streakLabel}: ${dict.learn.streakDays(count)}`}
    >
      <span aria-hidden="true">🔥</span>
      <span>{dict.learn.streakDays(count)}</span>
    </span>
  )
}

function CardMode({
  dict,
  language,
  name,
  phase,
  fading,
  drag,
  dragDirection,
  reversed,
  isFavorite,
  shuffleOn,
  audioState,
  cardRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  onReveal,
  onFlipSide,
  onToggleShuffle,
  onFavorite,
  onAudio,
  onSkip,
  onMarkLearned,
  onRepeat,
  nextThree,
}: {
  dict: ReturnType<typeof getDict>
  language: Language
  name: NameEntry
  phase: Phase
  fading: boolean
  drag: { x: number; y: number; active: boolean }
  dragDirection: DragDir
  reversed: boolean
  isFavorite: boolean
  shuffleOn: boolean
  audioState: 'idle' | 'playing' | 'unsupported'
  cardRef: React.RefObject<HTMLDivElement | null>
  onPointerDown: (e: React.PointerEvent) => void
  onPointerMove: (e: React.PointerEvent) => void
  onPointerUp: (e: React.PointerEvent) => void
  onPointerCancel: (e: React.PointerEvent) => void
  onReveal: () => void
  onFlipSide: () => void
  onToggleShuffle: () => void
  onFavorite: () => void
  onAudio: () => void
  onSkip: () => void
  onMarkLearned: () => void
  onRepeat: () => void
  nextThree: NameEntry[]
}) {
  const rotation = drag.active ? Math.max(-12, Math.min(12, drag.x / 18)) : 0
  const cardTransform = drag.active
    ? `translate(${drag.x}px, ${Math.min(0, drag.y)}px) rotate(${rotation}deg)`
    : 'translate(0,0) rotate(0)'

  return (
    <>
      {/* Flashcard */}
      <section
        ref={cardRef}
        key={name.id}
        className="relative touch-pan-y select-none rounded-lg border border-gold/20 flashcard-gradient-surface p-6"
        style={{
          opacity: fading ? 0 : 1,
          transform: cardTransform,
          transition: drag.active ? 'none' : 'transform 220ms ease, opacity 150ms ease',
          cursor: drag.active ? 'grabbing' : 'grab',
        }}
        aria-live="polite"
        aria-atomic="true"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClick={() => {
          if (phase === 'question' && !drag.active) onReveal()
        }}
      >
        {/* Card header: number + shuffle + favorite */}
        <div className="mb-4 flex items-center justify-between" data-no-swipe>
          <span className="rounded bg-surface-soft px-2 py-0.5 text-xs text-gold-muted tabular-nums">
            #{name.id.toString().padStart(2, '0')} / 99
          </span>
          <div className="flex items-center gap-2">
            <button
              className="focus-ring rounded px-2 py-1 text-xs text-muted/60 hover:text-gold/70 transition-colors"
              onClick={(e) => { e.stopPropagation(); onFlipSide() }}
              title={dict.learn.flipSide}
              aria-label={dict.learn.flipSide}
              type="button"
            >
              {reversed ? 'AR→' : '→AR'}
            </button>
            <button
              className={`focus-ring rounded px-2 py-1 text-base transition-colors ${
                shuffleOn ? 'text-gold' : 'text-muted/60 hover:text-gold/70'
              }`}
              onClick={(e) => { e.stopPropagation(); onToggleShuffle() }}
              title={shuffleOn ? dict.learn.shuffleOn : dict.learn.shuffleOff}
              aria-label={shuffleOn ? dict.learn.shuffleOn : dict.learn.shuffleOff}
              aria-pressed={shuffleOn}
              type="button"
            >
              ⇄
            </button>
            <button
              className={`focus-ring rounded p-1.5 text-2xl leading-none transition-all duration-150 ${
                isFavorite ? 'text-gold scale-110' : 'text-muted/50 hover:text-gold/70'
              }`}
              onClick={(e) => { e.stopPropagation(); onFavorite() }}
              aria-label={isFavorite ? dict.common.removeFavorite : dict.common.favorite}
              aria-pressed={isFavorite}
              type="button"
            >
              {isFavorite ? '★' : '☆'}
            </button>
          </div>
        </div>

        {/* Question side content */}
        {!reversed ? (
          <>
            <p className="text-right font-arabic text-7xl leading-tight tracking-wide" lang="ar" dir="rtl">
              {name.arabic}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onAudio() }}
                disabled={audioState === 'unsupported'}
                className={`focus-ring inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-surface-soft text-base transition-colors ${
                  audioState === 'unsupported'
                    ? 'opacity-40 cursor-not-allowed'
                    : audioState === 'playing'
                      ? 'border-gold/55 bg-gold/15 text-gold'
                      : 'text-muted hover:text-gold/80'
                }`}
                aria-label={audioState === 'unsupported' ? dict.learn.audioUnavailable : dict.learn.audioLabel}
                title={audioState === 'unsupported' ? dict.learn.audioUnavailable : dict.learn.audioLabel}
                data-no-swipe
              >
                <span aria-hidden="true">🔊</span>
              </button>
              <div className="text-right">
                <p className="text-2xl font-semibold italic">{name.transliteration[language]}</p>
                <p className="mt-0.5 text-sm text-gold-muted tracking-widest">{name.pronunciation[language]}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-2xl font-semibold">{name.transliteration[language]}</p>
            <p className="mt-1.5 text-lg font-medium text-gold">{name.meanings[language]}</p>
          </>
        )}

        {phase === 'question' ? (
          <div className="mt-8 space-y-3">
            <div className="rounded-lg border border-white/10 bg-surface-soft py-3.5 text-center">
              <p className="text-sm font-semibold text-primary">
                {reversed ? dict.learn.showArabic : dict.learn.showMeaning}
              </p>
              <p className="mt-1 text-xs italic text-muted/60">{dict.learn.tapToReveal}</p>
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-5" data-no-swipe>
            {reversed ? (
              <div>
                <p className="text-right font-arabic text-7xl leading-tight tracking-wide" lang="ar" dir="rtl">
                  {name.arabic}
                </p>
                <p className="mt-1.5 text-right text-sm text-gold-muted tracking-widest">{name.pronunciation[language]}</p>
                <p className="mt-3 leading-7 text-muted text-sm">{name.explanations[language]}</p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-semibold">{name.transliteration[language]}</p>
                <p className="mt-1.5 text-lg font-medium text-gold">{name.meanings[language]}</p>
                {language !== 'en' && (
                  <p className="mt-0.5 text-xs uppercase tracking-[0.18em] text-gold-muted/70">
                    EN · {name.meanings.en}
                  </p>
                )}
                <p className="mt-3 leading-7 text-muted text-sm">{name.explanations[language]}</p>
              </div>
            )}

            {name.duaUsage?.[language] && (
              <details className="rounded-lg border border-white/10 bg-surface-soft">
                <summary className="flex cursor-pointer select-none items-center gap-2 p-3.5 text-sm font-semibold text-gold focus-ring rounded-lg list-none [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true">🤲</span>
                  {dict.common.dua}
                  <span className="ml-auto text-muted/50 text-xs font-normal transition-transform details-chevron">▾</span>
                </summary>
                <p className="px-4 pb-4 pt-0 text-sm leading-7 text-muted">{name.duaUsage[language]}</p>
              </details>
            )}

            {name.reflection?.[language] && (
              <details className="rounded-lg border border-white/10 bg-surface-soft">
                <summary className="flex cursor-pointer select-none items-center gap-2 p-3.5 text-sm font-semibold text-gold-soft focus-ring rounded-lg list-none [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true">💭</span>
                  {dict.common.reflection}
                  <span className="ml-auto text-muted/50 text-xs font-normal">▾</span>
                </summary>
                <p className="px-4 pb-4 pt-0 text-sm leading-7 text-muted">{name.reflection[language]}</p>
              </details>
            )}
          </div>
        )}

        {/* Drag overlay hints */}
        {dragDirection && (
          <div
            className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg text-2xl font-bold uppercase tracking-[0.2em] ${
              dragDirection === 'left'
                ? 'bg-amber-400/15 text-amber-200'
                : dragDirection === 'right'
                  ? 'bg-emerald-500/15 text-emerald-300'
                  : 'bg-sky-500/15 text-sky-300'
            }`}
            aria-hidden="true"
          >
            <span className="rounded-md border border-current px-4 py-2">
              {dragDirection === 'left' && `← ${dict.learn.skipHint}`}
              {dragDirection === 'right' && `${dict.learn.learnedHint} →`}
              {dragDirection === 'up' && `↑ ${dict.learn.repeatHint}`}
            </span>
          </div>
        )}
      </section>

      {/* Action buttons (always visible) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3" style={{ opacity: fading ? 0 : 1 }}>
        <button
          type="button"
          className="btn-secondary flex-col gap-0.5 py-3"
          onClick={onSkip}
          aria-label={dict.learn.skip}
        >
          <span>{dict.learn.skip}</span>
        </button>
        <button
          type="button"
          className="btn-primary flex-col gap-0.5 py-3"
          onClick={onMarkLearned}
          aria-label={dict.learn.markLearned}
        >
          <span>{dict.learn.markLearned}</span>
        </button>
        <button
          type="button"
          className="btn-secondary flex-col gap-0.5 py-3"
          onClick={onRepeat}
          aria-label={dict.learn.repeat}
        >
          <span>{dict.learn.repeat}</span>
        </button>
      </div>

      {/* Details link only after reveal */}
      {phase === 'answer' && (
        <Link
          className="block text-center text-sm text-gold-muted hover:text-gold focus-ring rounded"
          href={getLocalizedNamePath(language, name.slug)}
        >
          {dict.learn.details} →
        </Link>
      )}

      {/* Next 3 strip */}
      {nextThree.length > 0 && (
        <section className="pt-3">
          <p className="mb-2 text-xs uppercase tracking-[0.22em] text-muted/60">{dict.learn.next3Title}</p>
          <ul className="grid grid-cols-3 gap-2">
            {nextThree.map((n) => (
              <li
                key={n.id}
                className="rounded-lg border border-white/5 bg-surface-soft/60 p-3 text-center"
              >
                <p className="text-xs uppercase tracking-widest text-muted/50 tabular-nums">
                  #{n.id.toString().padStart(2, '0')}
                </p>
                <p className="mt-1.5 text-right font-arabic text-2xl leading-none text-primary/80" lang="ar" dir="rtl">
                  {n.arabic}
                </p>
                <p className="mt-1.5 text-xs font-semibold text-muted">{n.transliteration[language]}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}

function CompletedScreen({
  embedded,
  dict,
  language,
  onRestart,
}: {
  embedded: boolean
  dict: ReturnType<typeof getDict>
  language: Language
  onRestart: () => void
}) {
  return (
    <section
      id="learn-now"
      className="mx-auto max-w-2xl scroll-mt-28 rounded-lg border border-gold/20 bg-surface p-8 text-center"
    >
      <div className="text-5xl" aria-hidden="true">🎉</div>
      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-gold">{dict.learn.eyebrow}</p>
      {embedded ? (
        <h2 className="mt-4 text-3xl font-semibold">{dict.learn.completedTitle}</h2>
      ) : (
        <h1 className="mt-4 text-3xl font-semibold">{dict.learn.completedTitle}</h1>
      )}
      <p className="mt-3 text-muted">{dict.learn.completedBody}</p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button type="button" className="btn-primary" onClick={onRestart}>
          {dict.learn.restart}
        </button>
        <Link href={getLocalizedNamesPath(language)} className="btn-secondary inline-flex">
          {dict.learn.overview}
        </Link>
      </div>
    </section>
  )
}

function BrowseMode({
  dict,
  language,
  progress,
  repeatIds,
  actions,
}: {
  dict: ReturnType<typeof getDict>
  language: Language
  progress: { learnedIds: number[]; favoriteIds: number[] }
  repeatIds: number[]
  actions: ReturnType<typeof useAppState>['actions']
}) {
  return (
    <section aria-label={dict.learn.modeList} className="space-y-2">
      <ol className="space-y-2">
        {names.map((name) => {
          const learned = progress.learnedIds.includes(name.id)
          const favorite = progress.favoriteIds.includes(name.id)
          const repeat = repeatIds.includes(name.id)
          return (
            <li key={name.id}>
              <div className="flex flex-col gap-2 rounded-lg border border-white/10 bg-surface px-3 py-3 transition-colors hover:border-gold/40">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 md:flex-nowrap md:items-stretch">
                  <span className="order-1 w-8 shrink-0 text-xs text-gold-muted tabular-nums">
                    #{name.id.toString().padStart(2, '0')}
                  </span>
                  <Link
                    href={getLocalizedNamePath(language, name.slug)}
                    className="order-3 flex w-full min-w-0 items-center gap-3 focus-ring rounded md:order-2 md:w-auto md:flex-1"
                  >
                    <span className="shrink-0 font-arabic text-2xl text-primary" lang="ar" dir="rtl">
                      {name.arabic}
                    </span>
                    <span className="flex-1 min-w-0 truncate">
                      <span className="block truncate text-sm font-semibold text-primary">{name.transliteration[language]}</span>
                      <span className="block truncate text-xs text-muted">{name.meanings[language]}</span>
                    </span>
                  </Link>
                  <div className="order-2 ml-auto flex shrink-0 items-center gap-1.5 md:order-3 md:ml-0">
                    {learned && (
                      <span className="rounded-full border border-success/40 bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                        {dict.learn.listLearned}
                      </span>
                    )}
                    {!learned && repeat && (
                      <span className="rounded-full border border-sky-400/40 bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-300">
                        {dict.learn.listRepeat}
                      </span>
                    )}
                    {!learned && !repeat && (
                      <span className="rounded-full border border-white/10 bg-surface-soft px-2 py-0.5 text-xs font-semibold text-muted">
                        {dict.learn.listOpen}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => actions.toggleFavorite(name.id)}
                      className={`focus-ring rounded p-1 text-lg leading-none transition-colors ${
                        favorite ? 'text-gold' : 'text-muted/50 hover:text-gold/70'
                      }`}
                      aria-label={favorite ? dict.common.removeFavorite : dict.common.favorite}
                      aria-pressed={favorite}
                    >
                      {favorite ? '★' : '☆'}
                    </button>
                  </div>
                </div>
                {/* Status action buttons */}
                <div className="flex gap-1.5">
                  {learned ? (
                    <button
                      type="button"
                      onClick={() => actions.unmarkLearned(name.id)}
                      className="focus-ring flex-1 rounded border border-white/10 bg-surface-soft px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold/40 hover:text-gold"
                      aria-label={dict.detail.markOpen}
                    >
                      {dict.detail.markOpen}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => actions.markLearned(name.id, name.slug)}
                      className="focus-ring flex-1 rounded border border-success/40 bg-success/10 px-2 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                      aria-label={dict.learn.markLearned}
                    >
                      {dict.learn.markLearned}
                    </button>
                  )}
                  {!learned && (
                    repeat ? (
                      <button
                        type="button"
                        onClick={() => actions.removeRepeat(name.id)}
                        className="focus-ring flex-1 rounded border border-white/10 bg-surface-soft px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:border-gold/40 hover:text-gold"
                        aria-label={dict.learn.skip}
                      >
                        {dict.learn.skip}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => actions.queueRepeat(name.id)}
                        className="focus-ring flex-1 rounded border border-sky-400/40 bg-sky-500/10 px-2 py-1.5 text-xs font-medium text-sky-300 transition-colors hover:bg-sky-500/20"
                        aria-label={dict.learn.repeat}
                      >
                        {dict.learn.repeat}
                      </button>
                    )
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
