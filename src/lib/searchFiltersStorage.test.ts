import { beforeEach, describe, expect, it } from 'vitest'
import { names } from '@/data/names'
import { filterNames } from './filters'
import { searchNames } from './search'
import { storage } from './storage'

describe('searchNames', () => {
  it('finds an Arabic name', () => {
    expect(searchNames(names, 'الرَّحْمَنُ', 'de')[0]?.slug).toBe('ar-rahman')
  })

  it('finds transliteration', () => {
    expect(searchNames(names, 'Rahman', 'en').some((name) => name.slug === 'ar-rahman')).toBe(true)
  })

  it('finds German meaning', () => {
    expect(searchNames(names, 'Barmherzige', 'de').some((name) => name.slug === 'ar-rahman')).toBe(true)
  })

  it('returns an empty array when there is no result', () => {
    expect(searchNames(names, 'not-a-real-name', 'de')).toEqual([])
  })
})

describe('filters and storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('filters learned names', () => {
    expect(filterNames(names, { learnedIds: [1], showLearned: true }).map((name) => name.id)).toEqual([1])
  })

  it('filters favorite names', () => {
    expect(filterNames(names, { favoriteIds: [2], showFavorites: true }).map((name) => name.id)).toEqual([2])
  })

  it('filters open names', () => {
    const result = filterNames(names.slice(0, 3), { learnedIds: [1], showUnlearned: true })
    expect(result.map((name) => name.id)).toEqual([2, 3])
  })

  it('roundtrips progress through storage', () => {
    const progress = {
      learnedIds: [1, 2],
      favoriteIds: [3],
      lastViewedSlug: 'ar-rahman',
      lastLearnedSlug: 'ar-rahim',
      updatedAt: '2026-05-01T00:00:00.000Z',
    }
    storage.setProgress(progress)
    expect(storage.getProgress()).toEqual(progress)
  })
})
