import { describe, expect, it } from 'vitest'
import {
  calculateFollowingNextSendAt,
  calculateInitialNextSendAt,
  isValidReminderInterval,
} from './reminders'

describe('push reminder scheduling', () => {
  it('validates supported reminder intervals', () => {
    expect(isValidReminderInterval('2h')).toBe(true)
    expect(isValidReminderInterval('6h')).toBe(true)
    expect(isValidReminderInterval('daily')).toBe(true)
    expect(isValidReminderInterval('weekly')).toBe(false)
  })

  it('calculates fixed hourly intervals', () => {
    const now = new Date('2026-05-02T10:00:00.000Z')

    expect(calculateInitialNextSendAt('2h', 'Europe/Zurich', now).toISOString())
      .toBe('2026-05-02T12:00:00.000Z')
    expect(calculateFollowingNextSendAt('6h', now).toISOString())
      .toBe('2026-05-02T16:00:00.000Z')
  })

  it('schedules initial daily reminders for the next local 08:00', () => {
    expect(calculateInitialNextSendAt('daily', 'Europe/Zurich', new Date('2026-05-02T04:30:00.000Z')).toISOString())
      .toBe('2026-05-02T06:00:00.000Z')
    expect(calculateInitialNextSendAt('daily', 'Europe/Zurich', new Date('2026-05-02T07:00:00.000Z')).toISOString())
      .toBe('2026-05-03T06:00:00.000Z')
  })

  it('falls back to one day for invalid timezones', () => {
    const now = new Date('2026-05-02T10:00:00.000Z')

    expect(calculateInitialNextSendAt('daily', 'Not/AZone', now).toISOString())
      .toBe('2026-05-03T10:00:00.000Z')
  })
})
