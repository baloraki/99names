'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Language } from '@/types/language'
import type { LearnMode, LearnState } from '@/types/learnState'
import type { ProgressState } from '@/types/progress'
import { markLearned, toggleFavorite, unmarkLearned } from '@/lib/progress'
import { storage } from '@/lib/storage'
import type { ThemeName } from '@/types/theme'
import { bumpStreak } from '@/lib/streak'

const initialProgress: ProgressState = {
  learnedIds: [],
  favoriteIds: [],
  updatedAt: '',
}

const initialLearnState: LearnState = {
  mode: 'card',
  shuffle: false,
  repeatIds: [],
  streakCount: 0,
  lastLearnedDate: '',
}

export function useAppState() {
  const [ready, setReady] = useState(false)
  const [language, setLanguageState] = useState<Language>('en')
  const [progress, setProgressState] = useState<ProgressState>(initialProgress)
  const [theme, setThemeState] = useState<ThemeName>('soft-light')
  const [learnState, setLearnStateValue] = useState<LearnState>(initialLearnState)

  useEffect(() => {
    queueMicrotask(() => {
      const storedLanguage = storage.getLanguage()
      setLanguageState(storedLanguage)
      setProgressState(storage.getProgress())
      const storedTheme = storage.getTheme()
      setThemeState(storedTheme)
      document.documentElement.dataset.theme = storedTheme
      setLearnStateValue(storage.getLearnState())
      document.documentElement.lang = storedLanguage
      setReady(true)
    })

    const onProgressChange = (event: Event) => {
      const next = (event as CustomEvent<ProgressState>).detail
      setProgressState(next)
    }
    const onLearnChange = (event: Event) => {
      const next = (event as CustomEvent<LearnState>).detail
      setLearnStateValue(next)
    }
    window.addEventListener('app-progress-change', onProgressChange)
    window.addEventListener('app-learn-change', onLearnChange)
    return () => {
      window.removeEventListener('app-progress-change', onProgressChange)
      window.removeEventListener('app-learn-change', onLearnChange)
    }
  }, [])

  const actions = useMemo(() => {
    function broadcastProgress(next: ProgressState) {
      window.dispatchEvent(new CustomEvent('app-progress-change', { detail: next }))
    }
    function broadcastLearn(next: LearnState) {
      window.dispatchEvent(new CustomEvent('app-learn-change', { detail: next }))
    }

    return {
      setLanguage(next: Language) {
        setLanguageState(next)
        storage.setLanguage(next)
        document.documentElement.lang = next
        window.dispatchEvent(new CustomEvent('app-language-change', { detail: next }))
      },
      setTheme(next: ThemeName) {
        setThemeState(next)
        storage.setTheme(next)
        document.documentElement.dataset.theme = next
      },
      markLearned(id: number, slug?: string) {
        setProgressState((current) => {
          const next = { ...markLearned(current, id), lastLearnedSlug: slug ?? current.lastLearnedSlug }
          storage.setProgress(next)
          broadcastProgress(next)
          return next
        })
        setLearnStateValue((current) => {
          const next = bumpStreak({ ...current, repeatIds: current.repeatIds.filter((x) => x !== id) })
          storage.setLearnState(next)
          broadcastLearn(next)
          return next
        })
      },
      unmarkLearned(id: number) {
        setProgressState((current) => {
          const next = unmarkLearned(current, id)
          storage.setProgress(next)
          broadcastProgress(next)
          return next
        })
      },
      toggleFavorite(id: number) {
        setProgressState((current) => {
          const next = toggleFavorite(current, id)
          storage.setProgress(next)
          broadcastProgress(next)
          return next
        })
      },
      setLastViewed(slug: string) {
        setProgressState((current) => {
          const next = { ...current, lastViewedSlug: slug, updatedAt: new Date().toISOString() }
          storage.setProgress(next)
          broadcastProgress(next)
          return next
        })
      },
      resetProgress() {
        const next = { learnedIds: [], favoriteIds: [], updatedAt: new Date().toISOString() }
        setProgressState(next)
        storage.setProgress(next)
        broadcastProgress(next)
        const nextLearn: LearnState = { ...initialLearnState }
        setLearnStateValue(nextLearn)
        storage.setLearnState(nextLearn)
        broadcastLearn(nextLearn)
      },
      setMode(mode: LearnMode) {
        setLearnStateValue((current) => {
          const next = { ...current, mode }
          storage.setLearnState(next)
          broadcastLearn(next)
          return next
        })
      },
      toggleShuffle() {
        setLearnStateValue((current) => {
          const next = { ...current, shuffle: !current.shuffle }
          storage.setLearnState(next)
          broadcastLearn(next)
          return next
        })
      },
      queueRepeat(id: number) {
        setLearnStateValue((current) => {
          if (current.repeatIds.includes(id)) return current
          const next = { ...current, repeatIds: [...current.repeatIds, id] }
          storage.setLearnState(next)
          broadcastLearn(next)
          return next
        })
      },
      removeRepeat(id: number) {
        setLearnStateValue((current) => {
          if (!current.repeatIds.includes(id)) return current
          const next = { ...current, repeatIds: current.repeatIds.filter((x) => x !== id) }
          storage.setLearnState(next)
          broadcastLearn(next)
          return next
        })
      },
    }
  }, [])

  return { ready, language, theme, progress, learnState, actions }
}
