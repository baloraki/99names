// import type { PushSubscription } from 'web-push'
// import { calculateFollowingNextSendAt, isValidReminderInterval, type ReminderInterval } from '@/lib/push/reminders'
// import { assertPushServerConfigured, sendPushNotification } from '@/lib/push/server'
// import { timingSafeEqual } from '@/lib/security'
// import { getSupabaseAdminClient } from '@/lib/supabase/server'
// import { isLanguage } from '@/lib/languagePreference'
// import type { Language } from '@/types/language'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Push notification system is not in use – returning 503 until re-enabled.
export async function GET() {
  return Response.json({ success: false, error: 'Push cron is not enabled.' }, { status: 503 })
}

/*
type PushSubscriptionRow = {
  endpoint: string
  p256dh: string
  auth: string
  reminder_interval: string
  timezone: string | null
  locale: string | null
  failed_count: number | null
}

type DeliveryStatus = 'sent' | 'failed' | 'expired'

type CronCounts = {
  total: number
  sent: number
  failed: number
  expired: number
}

const learnUrls: Record<Language, string> = {
  en: '/learn#learn-now',
  de: '/de/lernen#learn-now',
  tr: '/tr/ogren#learn-now',
}

const reminderTitles: Record<Language, string> = {
  en: 'Time to learn',
  de: 'Zeit zum Lernen',
  tr: 'Öğrenme zamanı',
}

const reminderBodies: Record<Language, string> = {
  en: 'Review one of the Names of Allah today.',
  de: 'Wiederhole heute einen Namen Allahs.',
  tr: 'Bugün Allah\'ın isimlerinden birini tekrarla.',
}

function getReminderPayload(locale: Language) {
  return {
    title: reminderTitles[locale],
    body: reminderBodies[locale],
    url: learnUrls[locale],
  }
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  const authorization = request.headers.get('authorization')

  if (!cronSecret || !authorization || !timingSafeEqual(authorization, `Bearer ${cronSecret}`)) {
    return Response.json({ success: false, error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    assertPushServerConfigured()
  } catch (error) {
    console.error('Push cron is missing VAPID configuration:', error)
    return Response.json({ success: false, error: 'Push cron is not configured.' }, { status: 500 })
  }

  let supabase
  try {
    supabase = getSupabaseAdminClient()
  } catch (error) {
    console.error('Push cron is missing Supabase configuration:', error)
    return Response.json({ success: false, error: 'Push cron database is not configured.' }, { status: 500 })
  }
  const now = new Date()
  const nowIso = now.toISOString()
  const lockUntilIso = new Date(now.getTime() + 5 * 60 * 1000).toISOString()

  const { data: dueRows, error: fetchError } = await supabase
    .from('push_subscriptions')
    .select('endpoint')
    .is('disabled_at', null)
    .lte('next_send_at', nowIso)
    .or(`locked_until.is.null,locked_until.lt.${nowIso}`)
    .order('next_send_at', { ascending: true })
    .limit(100)

  if (fetchError) {
    console.error('Push cron fetch failed:', fetchError)
    return Response.json({ success: false, error: 'Could not fetch due reminders.' }, { status: 500 })
  }

  const endpoints = (dueRows ?? [])
    .map((row) => row.endpoint)
    .filter((endpoint): endpoint is string => typeof endpoint === 'string' && endpoint.length > 0)

  if (endpoints.length === 0) {
    return Response.json({ success: true, total: 0, sent: 0, failed: 0, expired: 0 })
  }

  const { data: lockedRows, error: lockError } = await supabase
    .from('push_subscriptions')
    .update({
      locked_until: lockUntilIso,
      updated_at: nowIso,
    })
    .in('endpoint', endpoints)
    .is('disabled_at', null)
    .lte('next_send_at', nowIso)
    .or(`locked_until.is.null,locked_until.lt.${nowIso}`)
    .select('endpoint,p256dh,auth,reminder_interval,timezone,locale,failed_count')

  if (lockError) {
    console.error('Push cron lock failed:', lockError)
    return Response.json({ success: false, error: 'Could not lock due reminders.' }, { status: 500 })
  }

  const counts: CronCounts = {
    total: lockedRows?.length ?? 0,
    sent: 0,
    failed: 0,
    expired: 0,
  }

  for (const row of lockedRows ?? []) {
    await sendReminderForRow(row as PushSubscriptionRow, counts, now)
  }

  return Response.json({ success: true, ...counts })
}

async function sendReminderForRow(row: PushSubscriptionRow, counts: CronCounts, now: Date): Promise<void> {
  const supabase = getSupabaseAdminClient()
  const interval = getReminderInterval(row.reminder_interval)
  const locale: Language = isLanguage(row.locale) ? row.locale : 'en'
  const payload = getReminderPayload(locale)

  if (!interval) {
    const lastError = 'Invalid reminder interval stored for subscription.'
    const failedCount = (row.failed_count ?? 0) + 1
    await markFailed(row, failedCount, lastError)
    await insertDeliveryLog(row.endpoint, 'failed', lastError, payload)
    counts.failed += 1
    return
  }

  const subscription: PushSubscription = {
    endpoint: row.endpoint,
    keys: {
      p256dh: row.p256dh,
      auth: row.auth,
    },
  }

  try {
    await sendPushNotification(subscription, payload)

    const updateTime = new Date()
    const { error } = await supabase
      .from('push_subscriptions')
      .update({
        last_sent_at: updateTime.toISOString(),
        locked_until: null,
        failed_count: 0,
        last_error: null,
        next_send_at: calculateFollowingNextSendAt(interval, now).toISOString(),
        updated_at: updateTime.toISOString(),
      })
      .eq('endpoint', row.endpoint)

    if (error) throw error

    await insertDeliveryLog(row.endpoint, 'sent', null, payload)
    counts.sent += 1
  } catch (error) {
    const statusCode = getPushStatusCode(error)
    const lastError = getErrorMessage(error)

    if (statusCode === 404 || statusCode === 410) {
      await markExpired(row, lastError)
      await insertDeliveryLog(row.endpoint, 'expired', lastError, payload)
      counts.expired += 1
      return
    }

    const failedCount = (row.failed_count ?? 0) + 1
    await markFailed(row, failedCount, lastError)
    await insertDeliveryLog(row.endpoint, 'failed', lastError, payload)
    counts.failed += 1
  }
}

function getReminderInterval(value: string): ReminderInterval | null {
  return isValidReminderInterval(value) ? value : null
}

async function markExpired(row: PushSubscriptionRow, lastError: string): Promise<void> {
  const now = new Date().toISOString()
  const { error } = await getSupabaseAdminClient()
    .from('push_subscriptions')
    .update({
      disabled_at: now,
      locked_until: null,
      last_error: lastError,
      updated_at: now,
    })
    .eq('endpoint', row.endpoint)

  if (error) console.error('Could not mark push subscription expired:', error)
}

async function markFailed(row: PushSubscriptionRow, failedCount: number, lastError: string): Promise<void> {
  const now = new Date().toISOString()
  const shouldDisable = failedCount >= 5
  const update: {
    failed_count: number
    locked_until: null
    last_error: string
    updated_at: string
    disabled_at?: string
  } = {
    failed_count: failedCount,
    locked_until: null,
    last_error: lastError,
    updated_at: now,
  }

  if (shouldDisable) {
    update.disabled_at = now
  }

  const { error } = await getSupabaseAdminClient()
    .from('push_subscriptions')
    .update(update)
    .eq('endpoint', row.endpoint)

  if (error) console.error('Could not mark push subscription failed:', error)
}

async function insertDeliveryLog(endpoint: string, status: DeliveryStatus, errorMessage: string | null, payload: ReturnType<typeof getReminderPayload>): Promise<void> {
  const { error } = await getSupabaseAdminClient()
    .from('push_delivery_logs')
    .insert({
      endpoint,
      status,
      error_message: errorMessage,
      payload,
      created_at: new Date().toISOString(),
    })

  if (error) console.error('Could not insert push delivery log:', error)
}

function getPushStatusCode(error: unknown): number | null {
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    const statusCode = (error as { statusCode?: unknown }).statusCode
    return typeof statusCode === 'number' ? statusCode : null
  }
  return null
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message.slice(0, 1000)
  if (typeof error === 'string') return error.slice(0, 1000)

  try {
    return JSON.stringify(error).slice(0, 1000)
  } catch {
    return 'Unknown push error.'
  }
}
*/
