import { describe, expect, it } from 'vitest'
import { calculateNextDue, isValidInterval, learningIntervals } from './learningSchedule'
import { storage } from './storage'

describe('learning schedule', () => {
  it('defines valid intervals', () => {
    expect(learningIntervals).toEqual(['2h', '6h', 'daily'])
    expect(isValidInterval('2h')).toBe(true)
    expect(isValidInterval('bad')).toBe(false)
  })

  it('rejects an invalid interval', () => {
    expect(() => calculateNextDue({ enabled: true, interval: 'bad' as 'daily' })).toThrow('Invalid learning schedule interval')
  })

  it('calculates next due dates correctly', () => {
    const now = new Date('2026-05-01T10:00:00.000Z')
    expect(calculateNextDue({ enabled: true, interval: '2h' }, now)?.toISOString()).toBe('2026-05-01T12:00:00.000Z')
    expect(calculateNextDue({ enabled: true, interval: '6h' }, now)?.toISOString()).toBe('2026-05-01T16:00:00.000Z')
    expect(calculateNextDue({ enabled: true, interval: 'daily' }, now)?.toISOString()).toBe('2026-05-02T10:00:00.000Z')
  })

  it('roundtrips settings through storage', () => {
    const settings = {
      enabled: true,
      interval: '6h' as const,
      lastCompletedAt: '2026-05-01T10:00:00.000Z',
      nextDueAt: '2026-05-01T16:00:00.000Z',
    }
    storage.setSchedule(settings)
    expect(storage.getSchedule()).toEqual(settings)
  })
})
