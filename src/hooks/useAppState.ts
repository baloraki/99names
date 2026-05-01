'use client'

import { useEffect, useMemo, useState } from 'react'
import type { Language } from '@/types/language'
import type { LearningScheduleSettings } from '@/types/learningSchedule'
import type { ProgressState } from '@/types/progress'
import { markCompleted } from '@/lib/learningSchedule'
import { markLearned, toggleFavorite, unmarkLearned } from '@/lib/progress'
import { storage } from '@/lib/storage'

const initialProgress: ProgressState = {
  learnedIds: [],
  favoriteIds: [],
  updatedAt: '',
}

const initialSchedule: LearningScheduleSettings = {
  enabled: false,
  interval: 'daily',
}

export function useAppState() {
  const [ready, setReady] = useState(false)
  const [language, setLanguageState] = useState<Language>('de')
  const [progress, setProgressState] = useState<ProgressState>(initialProgress)
  const [schedule, setScheduleState] = useState<LearningScheduleSettings>(initialSchedule)

  useEffect(() => {
    queueMicrotask(() => {
      const storedLanguage = storage.getLanguage()
      setLanguageState(storedLanguage)
      setProgressState(storage.getProgress())
      setScheduleState(storage.getSchedule())
      document.documentElement.lang = storedLanguage
      setReady(true)
    })
  }, [])

  const actions = useMemo(() => ({
    setLanguage(next: Language) {
      setLanguageState(next)
      storage.setLanguage(next)
      document.documentElement.lang = next
      window.dispatchEvent(new CustomEvent('app-language-change', { detail: next }))
    },
    setSchedule(next: LearningScheduleSettings) {
      setScheduleState(next)
      storage.setSchedule(next)
    },
    markLearned(id: number, slug?: string) {
      setProgressState((current) => {
        const next = { ...markLearned(current, id), lastLearnedSlug: slug ?? current.lastLearnedSlug }
        storage.setProgress(next)
        return next
      })
      setScheduleState((current) => {
        if (!current.enabled) return current
        const next = markCompleted(current)
        storage.setSchedule(next)
        return next
      })
    },
    unmarkLearned(id: number) {
      setProgressState((current) => {
        const next = unmarkLearned(current, id)
        storage.setProgress(next)
        return next
      })
    },
    toggleFavorite(id: number) {
      setProgressState((current) => {
        const next = toggleFavorite(current, id)
        storage.setProgress(next)
        return next
      })
    },
    setLastViewed(slug: string) {
      setProgressState((current) => {
        const next = { ...current, lastViewedSlug: slug, updatedAt: new Date().toISOString() }
        storage.setProgress(next)
        return next
      })
    },
    resetProgress() {
      const next = { learnedIds: [], favoriteIds: [], updatedAt: new Date().toISOString() }
      setProgressState(next)
      storage.setProgress(next)
    },
  }), [])

  return { ready, language, progress, schedule, actions }
}
