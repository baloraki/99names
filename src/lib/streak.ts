import type { LearnState } from '@/types/learnState'

export function isoDay(date: Date = new Date()): string {
  const y = date.getFullYear()
  const m = (date.getMonth() + 1).toString().padStart(2, '0')
  const d = date.getDate().toString().padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number)
  const [by, bm, bd] = b.split('-').map(Number)
  const ms = Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)
  return Math.round(ms / 86400000)
}

export function bumpStreak(state: LearnState, today: string = isoDay()): LearnState {
  if (state.lastLearnedDate === today) return state
  if (!state.lastLearnedDate) return { ...state, streakCount: 1, lastLearnedDate: today }
  const diff = daysBetween(state.lastLearnedDate, today)
  if (diff === 1) return { ...state, streakCount: state.streakCount + 1, lastLearnedDate: today }
  return { ...state, streakCount: 1, lastLearnedDate: today }
}

export function currentStreak(state: LearnState, today: string = isoDay()): number {
  if (!state.lastLearnedDate) return 0
  const diff = daysBetween(state.lastLearnedDate, today)
  if (diff <= 1) return state.streakCount
  return 0
}
