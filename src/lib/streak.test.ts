import { describe, expect, it } from 'vitest'
import type { LearnState } from '@/types/learnState'
import { bumpStreak, currentStreak, daysBetween, isoDay } from './streak'

const baseState: LearnState = {
  mode: 'card',
  shuffle: false,
  repeatIds: [],
  streakCount: 0,
  lastLearnedDate: '',
}

describe('streak', () => {
  it('isoDay returns YYYY-MM-DD', () => {
    expect(isoDay(new Date('2026-05-02T10:00:00Z'))).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('daysBetween returns 1 for consecutive days', () => {
    expect(daysBetween('2026-05-01', '2026-05-02')).toBe(1)
  })

  it('daysBetween handles month boundaries', () => {
    expect(daysBetween('2026-04-30', '2026-05-01')).toBe(1)
    expect(daysBetween('2026-04-30', '2026-05-02')).toBe(2)
  })

  it('bumpStreak starts a streak from empty state', () => {
    const next = bumpStreak(baseState, '2026-05-02')
    expect(next.streakCount).toBe(1)
    expect(next.lastLearnedDate).toBe('2026-05-02')
  })

  it('bumpStreak increments on consecutive day', () => {
    const day1 = bumpStreak(baseState, '2026-05-01')
    const day2 = bumpStreak(day1, '2026-05-02')
    expect(day2.streakCount).toBe(2)
  })

  it('bumpStreak does not double-count on same day', () => {
    const first = bumpStreak(baseState, '2026-05-02')
    const second = bumpStreak(first, '2026-05-02')
    expect(second.streakCount).toBe(1)
  })

  it('bumpStreak resets to 1 after a gap', () => {
    const day1 = bumpStreak(baseState, '2026-04-29')
    const later = bumpStreak(day1, '2026-05-02')
    expect(later.streakCount).toBe(1)
  })

  it('currentStreak returns 0 when no streak recorded', () => {
    expect(currentStreak(baseState, '2026-05-02')).toBe(0)
  })

  it('currentStreak returns the count when last date is today or yesterday', () => {
    const state = { ...baseState, streakCount: 5, lastLearnedDate: '2026-05-02' }
    expect(currentStreak(state, '2026-05-02')).toBe(5)
    expect(currentStreak(state, '2026-05-03')).toBe(5)
  })

  it('currentStreak returns 0 when last date is too old', () => {
    const state = { ...baseState, streakCount: 5, lastLearnedDate: '2026-04-29' }
    expect(currentStreak(state, '2026-05-02')).toBe(0)
  })
})
