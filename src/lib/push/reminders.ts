export const reminderIntervals = ['2h', '6h', 'daily'] as const

export type ReminderInterval = (typeof reminderIntervals)[number]

const intervalMs: Record<ReminderInterval, number> = {
  '2h': 2 * 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  daily: 24 * 60 * 60 * 1000,
}

type TimeZoneParts = {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

export function isValidReminderInterval(value: unknown): value is ReminderInterval {
  return typeof value === 'string' && reminderIntervals.includes(value as ReminderInterval)
}

export function calculateInitialNextSendAt(
  reminderInterval: ReminderInterval,
  timezone: string,
  now: Date = new Date()
): Date {
  if (reminderInterval !== 'daily') {
    return new Date(now.getTime() + intervalMs[reminderInterval])
  }

  return calculateNextLocalMorning(timezone, now) ?? new Date(now.getTime() + intervalMs.daily)
}

export function calculateFollowingNextSendAt(
  reminderInterval: ReminderInterval,
  now: Date = new Date()
): Date {
  return new Date(now.getTime() + intervalMs[reminderInterval])
}

function calculateNextLocalMorning(timezone: string, now: Date): Date | null {
  const currentParts = getTimeZoneParts(now, timezone)
  if (!currentParts) return null

  const todayAtEight = zonedTimeToUtc({
    ...currentParts,
    hour: 8,
    minute: 0,
    second: 0,
  }, timezone)

  if (todayAtEight && todayAtEight.getTime() > now.getTime()) {
    return todayAtEight
  }

  const nextDate = addLocalDays(currentParts, 1)
  return zonedTimeToUtc({
    ...nextDate,
    hour: 8,
    minute: 0,
    second: 0,
  }, timezone)
}

function getTimeZoneParts(date: Date, timezone: string): TimeZoneParts | null {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })

    const parts = Object.fromEntries(
      formatter.formatToParts(date)
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value])
    )

    const hour = Number(parts.hour === '24' ? '0' : parts.hour)
    const result = {
      year: Number(parts.year),
      month: Number(parts.month),
      day: Number(parts.day),
      hour,
      minute: Number(parts.minute),
      second: Number(parts.second),
    }

    return Object.values(result).every(Number.isFinite) ? result : null
  } catch {
    return null
  }
}

function zonedTimeToUtc(parts: TimeZoneParts, timezone: string): Date | null {
  const utcGuess = new Date(Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  ))
  const firstOffset = getTimeZoneOffsetMs(utcGuess, timezone)
  if (firstOffset === null) return null

  const adjusted = new Date(utcGuess.getTime() - firstOffset)
  const secondOffset = getTimeZoneOffsetMs(adjusted, timezone)
  if (secondOffset === null) return null

  const result = new Date(utcGuess.getTime() - secondOffset)
  return Number.isFinite(result.getTime()) ? result : null
}

function getTimeZoneOffsetMs(date: Date, timezone: string): number | null {
  const parts = getTimeZoneParts(date, timezone)
  if (!parts) return null

  const localAsUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  )

  return localAsUtc - date.getTime()
}

function addLocalDays(parts: TimeZoneParts, days: number): Pick<TimeZoneParts, 'year' | 'month' | 'day'> {
  const date = new Date(Date.UTC(parts.year, parts.month - 1, parts.day + days))
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}
