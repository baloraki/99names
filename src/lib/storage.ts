import type { ProgressState } from '@/types/progress'
import type { LearningScheduleSettings } from '@/types/learningSchedule'
import type { LearnState } from '@/types/learnState'
import type { Language } from '@/types/language'
import {
  createClearedLanguageCookie,
  createLanguageCookie,
  getBrowserLanguage,
  getLanguageFromCookieHeader,
  isLanguage,
} from './languagePreference'
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
  updatedAt: '',
}

const defaultSchedule: LearningScheduleSettings = {
  enabled: false,
  interval: 'daily',
}

const defaultLearnState: LearnState = {
  mode: 'card',
  shuffle: false,
  repeatIds: [],
  streakCount: 0,
  lastLearnedDate: '',
}

export const storage = {
  getProgress(): ProgressState {
    const stored = getItem<ProgressState>(STORAGE_KEYS.PROGRESS)
    return stored ?? { ...defaultProgress, updatedAt: new Date().toISOString() }
  },
  setProgress(progress: ProgressState): void {
    setItem(STORAGE_KEYS.PROGRESS, progress)
  },
  getLanguage(): Language {
    const storedLanguage = getItem<unknown>(STORAGE_KEYS.LANGUAGE)
    if (isLanguage(storedLanguage)) return storedLanguage

    const cookieLanguage = isClient ? getLanguageFromCookieHeader(window.document.cookie) : null
    return cookieLanguage ?? getBrowserLanguage()
  },
  setLanguage(language: Language): void {
    setItem(STORAGE_KEYS.LANGUAGE, language)
    if (isClient) {
      window.document.cookie = createLanguageCookie(language)
    }
  },
  getSchedule(): LearningScheduleSettings {
    return getItem<LearningScheduleSettings>(STORAGE_KEYS.SCHEDULE) ?? { ...defaultSchedule }
  },
  setSchedule(schedule: LearningScheduleSettings): void {
    setItem(STORAGE_KEYS.SCHEDULE, schedule)
  },
  getLearnState(): LearnState {
    const stored = getItem<Partial<LearnState>>(STORAGE_KEYS.LEARN_STATE)
    if (!stored) return { ...defaultLearnState }
    return { ...defaultLearnState, ...stored }
  },
  setLearnState(state: LearnState): void {
    setItem(STORAGE_KEYS.LEARN_STATE, state)
  },
  clearAll(): void {
    removeItem(STORAGE_KEYS.PROGRESS)
    removeItem(STORAGE_KEYS.LANGUAGE)
    removeItem(STORAGE_KEYS.SCHEDULE)
    removeItem(STORAGE_KEYS.LEARN_STATE)
    if (isClient) {
      window.document.cookie = createClearedLanguageCookie()
    }
  },
}
