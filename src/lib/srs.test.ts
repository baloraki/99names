import { beforeEach, describe, expect, it } from 'vitest'
import {
  applyReview,
  createCard,
  DEFAULT_EASE_FACTOR,
  dueCardIds,
  emptyState,
  ensureCards,
  EASY_BONUS,
  isDue,
  MIN_EASE_FACTOR,
  MS_PER_DAY,
  parseSrsState,
  pickPromptType,
  reviewCard,
  setPromptPreference,
} from './srs'
import { storage } from './storage'

const NOW = Date.UTC(2026, 4, 4, 12, 0, 0)

describe('srs algorithm', () => {
  it('creates a card due immediately at the supplied timestamp', () => {
    const card = createCard('1', NOW)
    expect(card).toEqual({ id: '1', interval: 0, easeFactor: DEFAULT_EASE_FACTOR, nextReviewDate: NOW })
    expect(isDue(card, NOW)).toBe(true)
  })

  it('hard grade resets interval to one day and lowers ease factor', () => {
    const card = createCard('1', NOW)
    const next = reviewCard({ ...card, interval: 12, easeFactor: 2.0 }, 'hard', NOW)
    expect(next.interval).toBe(1)
    expect(next.easeFactor).toBeCloseTo(1.8, 5)
    expect(next.nextReviewDate).toBe(NOW + MS_PER_DAY)
  })

  it('hard grade clamps ease factor to the minimum', () => {
    const card = { ...createCard('1', NOW), easeFactor: 1.4 }
    const next = reviewCard(card, 'hard', NOW)
    expect(next.easeFactor).toBe(MIN_EASE_FACTOR)
  })

  it('good grade follows SM-2 step ladder and preserves ease factor', () => {
    const initial = createCard('1', NOW)
    const first = reviewCard(initial, 'good', NOW)
    expect(first.interval).toBe(1)
    expect(first.easeFactor).toBe(DEFAULT_EASE_FACTOR)
    expect(first.nextReviewDate).toBe(NOW + MS_PER_DAY)

    const second = reviewCard(first, 'good', NOW + MS_PER_DAY)
    expect(second.interval).toBe(6)

    const third = reviewCard(second, 'good', NOW + 7 * MS_PER_DAY)
    expect(third.interval).toBe(Math.ceil(6 * DEFAULT_EASE_FACTOR))
  })

  it('easy grade boosts interval and bumps ease factor', () => {
    const initial = createCard('1', NOW)
    const first = reviewCard(initial, 'easy', NOW)
    expect(first.interval).toBe(4)
    expect(first.easeFactor).toBeCloseTo(DEFAULT_EASE_FACTOR + 0.1, 5)
    expect(first.nextReviewDate).toBe(NOW + 4 * MS_PER_DAY)

    const second = reviewCard(first, 'easy', NOW + 4 * MS_PER_DAY)
    expect(second.interval).toBe(Math.ceil(first.interval * first.easeFactor * EASY_BONUS))
    expect(second.easeFactor).toBeCloseTo(DEFAULT_EASE_FACTOR + 0.2, 5)

    const third = reviewCard(second, 'easy', NOW + 18 * MS_PER_DAY)
    expect(third.interval).toBe(Math.ceil(second.interval * second.easeFactor * EASY_BONUS))
  })

  it('isDue uses the next review date in UTC milliseconds', () => {
    const card = { ...createCard('1', NOW), nextReviewDate: NOW + 5 }
    expect(isDue(card, NOW)).toBe(false)
    expect(isDue(card, NOW + 5)).toBe(true)
    expect(isDue(card, NOW + 1000)).toBe(true)
  })
})

describe('srs state operations', () => {
  it('seeds new cards without overwriting existing ones', () => {
    const state = ensureCards(emptyState(NOW), ['1', '2'], NOW)
    expect(Object.keys(state.cards)).toEqual(['1', '2'])
    const reviewed = applyReview(state, '1', 'good', NOW)
    const reseeded = ensureCards(reviewed, ['1', '2', '3'], NOW + MS_PER_DAY)
    expect(reseeded.cards['1']).toBe(reviewed.cards['1'])
    expect(reseeded.cards['3']).toBeDefined()
    expect(reseeded.cards['3'].interval).toBe(0)
  })

  it('returns identity when no new cards are added', () => {
    const before = ensureCards(emptyState(NOW), ['1', '2'], NOW)
    const after = ensureCards(before, ['1', '2'], NOW + 5)
    expect(after).toBe(before)
  })

  it('dueCardIds includes uninitialized ids and excludes scheduled ones', () => {
    const seeded = ensureCards(emptyState(NOW), ['1', '2', '3'], NOW)
    const reviewed = applyReview(seeded, '1', 'good', NOW)
    const due = dueCardIds(reviewed, ['1', '2', '3', '4'], NOW)
    expect(due).toEqual(['2', '3', '4'])
    const dueLater = dueCardIds(reviewed, ['1', '2', '3'], NOW + 2 * MS_PER_DAY)
    expect(dueLater).toContain('1')
  })

  it('applyReview seeds the card if it does not exist yet', () => {
    const state = applyReview(emptyState(NOW), '7', 'easy', NOW)
    expect(state.cards['7']).toBeDefined()
    expect(state.cards['7'].interval).toBe(4)
  })

  it('setPromptPreference returns identity when unchanged', () => {
    const state = emptyState(NOW)
    expect(setPromptPreference(state, 'random', NOW + 10)).toBe(state)
    const next = setPromptPreference(state, 'meaning', NOW + 10)
    expect(next.promptPreference).toBe('meaning')
    expect(next.updatedAt).toBe(NOW + 10)
  })

  it('pickPromptType respects the preference and falls back via rng', () => {
    expect(pickPromptType('meaning')).toBe('meaning')
    expect(pickPromptType('transliteration')).toBe('transliteration')
    expect(pickPromptType('random', () => 0.1)).toBe('meaning')
    expect(pickPromptType('random', () => 0.9)).toBe('transliteration')
  })
})

describe('srs serialization', () => {
  it('parseSrsState falls back to empty state for malformed input', () => {
    expect(parseSrsState(null, NOW).cards).toEqual({})
    expect(parseSrsState({ cards: 'oops' }, NOW).cards).toEqual({})
    expect(parseSrsState({ cards: { '1': { id: '1' } } }, NOW).cards).toEqual({})
  })

  it('parseSrsState keeps valid cards and sanitizes prompt preference', () => {
    const valid = {
      cards: {
        '1': { id: '1', nextReviewDate: NOW, interval: 6, easeFactor: 2.4 },
        bad: { id: 1, nextReviewDate: 'oops', interval: 1, easeFactor: 2 },
      },
      promptPreference: 'meaning',
      updatedAt: NOW,
    }
    const parsed = parseSrsState(valid, NOW)
    expect(parsed.cards['1']).toEqual(valid.cards['1'])
    expect(parsed.cards.bad).toBeUndefined()
    expect(parsed.promptPreference).toBe('meaning')
    expect(parsed.updatedAt).toBe(NOW)
  })

  it('parseSrsState defaults invalid prompt preference', () => {
    const parsed = parseSrsState({ cards: {}, promptPreference: 'whatever' }, NOW)
    expect(parsed.promptPreference).toBe('random')
  })
})

describe('srs storage roundtrip', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('persists and restores state through storage', () => {
    const state = applyReview(ensureCards(emptyState(NOW), ['1', '2'], NOW), '1', 'good', NOW)
    storage.setSrsState(state)
    const restored = storage.getSrsState()
    expect(restored.cards['1'].interval).toBe(1)
    expect(restored.cards['2'].interval).toBe(0)
    expect(restored.promptPreference).toBe('random')
  })

  it('returns an empty state when storage has no entry', () => {
    const restored = storage.getSrsState()
    expect(restored.cards).toEqual({})
    expect(restored.promptPreference).toBe('random')
  })

  it('ignores corrupt JSON gracefully', () => {
    window.localStorage.setItem('app:v1:srs', '{not json')
    const restored = storage.getSrsState()
    expect(restored.cards).toEqual({})
    expect(restored.promptPreference).toBe('random')
  })
})
