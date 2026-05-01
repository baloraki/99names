import type { ProgressState } from '@/types/progress'
import type { LearningScheduleSettings } from '@/types/learningSchedule'
import type { Language } from '@/types/language'
import { STORAGE_KEYS } from './constants'

const isClient = typeof window !== 'undefined'

function getItem<T>(key: string): T | null {
  if (!isClient) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

function setItem<T>(key: string, value: T): void {
  if (!isClient) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage quota exceeded or unavailable
  }
}

function removeItem(key: string): void {
  if (!isClient) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

const defaultProgress: ProgressState = {
  learnedIds: [],
  favoriteIds: [],
  updatedAt: new Date().toISOString(),
}

const defaultSchedule: LearningScheduleSettings = {
  enabled: false,
  interval: 'daily',
}

export const storage = {
  getProgress(): ProgressState {
    return getItem<ProgressState>(STORAGE_KEYS.PROGRESS) ?? defaultProgress
  },
  setProgress(progress: ProgressState): void {
    setItem(STORAGE_KEYS.PROGRESS, progress)
  },
  getLanguage(): Language {
    return getItem<Language>(STORAGE_KEYS.LANGUAGE) ?? 'de'
  },
  setLanguage(language: Language): void {
    setItem(STORAGE_KEYS.LANGUAGE, language)
  },
  getSchedule(): LearningScheduleSettings {
    return getItem<LearningScheduleSettings>(STORAGE_KEYS.SCHEDULE) ?? defaultSchedule
  },
  setSchedule(schedule: LearningScheduleSettings): void {
    setItem(STORAGE_KEYS.SCHEDULE, schedule)
  },
  clearAll(): void {
    removeItem(STORAGE_KEYS.PROGRESS)
    removeItem(STORAGE_KEYS.LANGUAGE)
    removeItem(STORAGE_KEYS.SCHEDULE)
  },
}
