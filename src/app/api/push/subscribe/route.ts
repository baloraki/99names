// import { getSupabaseAdminClient } from '@/lib/supabase/server'
// import {
//   calculateInitialNextSendAt,
//   isValidReminderInterval,
//   type ReminderInterval,
// } from '@/lib/push/reminders'
// import { isLanguage } from '@/lib/languagePreference'
// import type { Language } from '@/types/language'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Push notification system is not in use – returning 503 until re-enabled.
export async function POST() {
  return Response.json({ success: false, error: 'Push notifications are currently disabled.' }, { status: 503 })
}

/*
type PushSubscriptionInput = {
  endpoint?: unknown
  keys?: {
    p256dh?: unknown
    auth?: unknown
  }
}

type SubscribeBody = {
  subscription?: PushSubscriptionInput
  reminderInterval?: unknown
  timezone?: unknown
  locale?: unknown
}

export async function POST(request: Request) {
  let body: SubscribeBody

  try {
    body = await request.json() as SubscribeBody
  } catch {
    return Response.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 })
  }

  const validation = validateSubscribeBody(body)
  if (!validation.valid) {
    return Response.json({ success: false, error: validation.error }, { status: 400 })
  }

  const now = new Date()
  const timezone = normalizeTimezone(body.timezone)
  const locale = normalizeLocale(body.locale)
  const nextSendAt = calculateInitialNextSendAt(validation.reminderInterval, timezone, now)

  try {
    const supabase = getSupabaseAdminClient()
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint: validation.subscription.endpoint,
        p256dh: validation.subscription.keys.p256dh,
        auth: validation.subscription.keys.auth,
        reminder_interval: validation.reminderInterval,
        timezone,
        locale,
        next_send_at: nextSendAt.toISOString(),
        disabled_at: null,
        failed_count: 0,
        last_error: null,
        locked_until: null,
        user_agent: request.headers.get('user-agent'),
        updated_at: now.toISOString(),
      }, {
        onConflict: 'endpoint',
      })

    if (error) {
      return Response.json({ success: false, error: 'Could not store push subscription.' }, { status: 500 })
    }

    return Response.json({
      success: true,
      nextSendAt: nextSendAt.toISOString(),
    })
  } catch (error) {
    console.error('Push subscribe failed:', error)
    return Response.json({ success: false, error: 'Push subscription is not configured.' }, { status: 500 })
  }
}

function validateSubscribeBody(body: SubscribeBody):
  | {
    valid: true
    subscription: {
      endpoint: string
      keys: {
        p256dh: string
        auth: string
      }
    }
    reminderInterval: ReminderInterval
  }
  | { valid: false; error: string } {
  const subscription = body.subscription

  if (!subscription || typeof subscription.endpoint !== 'string' || !subscription.endpoint) {
    return { valid: false, error: 'subscription.endpoint is required.' }
  }

  if (!subscription.keys || typeof subscription.keys.p256dh !== 'string' || !subscription.keys.p256dh) {
    return { valid: false, error: 'subscription.keys.p256dh is required.' }
  }

  if (typeof subscription.keys.auth !== 'string' || !subscription.keys.auth) {
    return { valid: false, error: 'subscription.keys.auth is required.' }
  }

  if (!isValidReminderInterval(body.reminderInterval)) {
    return { valid: false, error: 'reminderInterval must be "2h", "6h", or "daily".' }
  }

  return {
    valid: true,
    subscription: {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    },
    reminderInterval: body.reminderInterval,
  }
}

function normalizeTimezone(value: unknown): string {
  if (typeof value !== 'string') return 'UTC'
  const timezone = value.trim()
  return timezone.length > 0 && timezone.length <= 100 ? timezone : 'UTC'
}

function normalizeLocale(value: unknown): Language {
  if (typeof value === 'string' && isLanguage(value)) return value
  return 'en'
}
*/
