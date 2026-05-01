import type { LearningScheduleSettings } from '@/types/learningSchedule'

const INTERVAL_MS: Record<LearningScheduleSettings['interval'], number> = {
  '2h': 2 * 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  'daily': 24 * 60 * 60 * 1000,
}

export function calculateNextDue(
  settings: LearningScheduleSettings,
  now: Date = new Date()
): Date | null {
  if (!settings.enabled) return null
  const base = settings.lastCompletedAt ? new Date(settings.lastCompletedAt) : now
  return new Date(base.getTime() + INTERVAL_MS[settings.interval])
}

export function isDue(settings: LearningScheduleSettings, now: Date = new Date()): boolean {
  if (!settings.enabled) return false
  if (!settings.nextDueAt) return true
  return now >= new Date(settings.nextDueAt)
}

export function markCompleted(
  settings: LearningScheduleSettings,
  now: Date = new Date()
): LearningScheduleSettings {
  const nextDueAt = new Date(now.getTime() + INTERVAL_MS[settings.interval])
  return {
    ...settings,
    lastCompletedAt: now.toISOString(),
    nextDueAt: nextDueAt.toISOString(),
  }
}
