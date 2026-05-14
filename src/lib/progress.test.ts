import { describe, expect, it } from 'vitest'
import type { ProgressState } from '@/types/progress'
import { markLearned, unmarkLearned, toggleFavorite, getProgressPercentage } from './progress'

const baseState: ProgressState = {
  learnedIds: [],
  favoriteIds: [],
  updatedAt: '2025-01-01T00:00:00.000Z',
}

describe('progress', () => {
  describe('markLearned', () => {
    it('marks an ID as learned', () => {
      const next = markLearned(baseState, 1)
      expect(next.learnedIds).toContain(1)
      expect(next.updatedAt).not.toBe(baseState.updatedAt)
    })

    it('does not add duplicate IDs', () => {
      const state = { ...baseState, learnedIds: [1] }
      const next = markLearned(state, 1)
      expect(next.learnedIds).toEqual([1])
      expect(next.updatedAt).toBe(state.updatedAt)
    })

    it('preserves other properties', () => {
      const state = { ...baseState, favoriteIds: [5] }
      const next = markLearned(state, 1)
      expect(next.favoriteIds).toContain(5)
    })
  })

  describe('unmarkLearned', () => {
    it('removes an ID from learnedIds', () => {
      const state = { ...baseState, learnedIds: [1, 2] }
      const next = unmarkLearned(state, 1)
      expect(next.learnedIds).toEqual([2])
      expect(next.updatedAt).not.toBe(state.updatedAt)
    })

    it('handles IDs that are not present', () => {
      const next = unmarkLearned(baseState, 1)
      expect(next.learnedIds).toEqual([])
      expect(next.updatedAt).not.toBe(baseState.updatedAt)
    })
  })

  describe('toggleFavorite', () => {
    it('adds an ID to favorites if not present', () => {
      const next = toggleFavorite(baseState, 1)
      expect(next.favoriteIds).toContain(1)
      expect(next.updatedAt).not.toBe(baseState.updatedAt)
    })

    it('removes an ID from favorites if present', () => {
      const state = { ...baseState, favoriteIds: [1] }
      const next = toggleFavorite(state, 1)
      expect(next.favoriteIds).not.toContain(1)
      expect(next.updatedAt).not.toBe(state.updatedAt)
    })
  })

  describe('getProgressPercentage', () => {
    it('returns 0 for empty progress', () => {
      expect(getProgressPercentage(baseState)).toBe(0)
    })

    it('returns 100 when all 99 names are learned', () => {
      const learnedIds = Array.from({ length: 99 }, (_, i) => i + 1)
      const state = { ...baseState, learnedIds }
      expect(getProgressPercentage(state)).toBe(100)
    })

    it('calculates percentage correctly for partial progress', () => {
      const learnedIds = Array.from({ length: 50 }, (_, i) => i + 1)
      const state = { ...baseState, learnedIds }
      // 50 / 99 * 100 = 50.5050... Math.round(50.5050) = 51
      expect(getProgressPercentage(state)).toBe(51)
    })
  })
})
