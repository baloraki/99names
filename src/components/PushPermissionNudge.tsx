'use client'

import { useEffect, useState } from 'react'
import type { ReminderInterval } from '@/lib/push/reminders'
import {
  getBrowserTimeZone,
  getCurrentPushSubscription,
  persistPushReminderSettings,
  postponePushSoftPrompt,
  readPersistedPushReminderSettings,
  requestNotificationPermission,
  shouldShowPushSoftPrompt,
  subscribeBrowserToPush,
} from '@/lib/push/client'

export function PushPermissionNudge({
  title,
  body,
  enableLabel,
  laterLabel,
}: {
  title: string
  body: string
  enableLabel: string
  laterLabel: string
}) {
  const [visible, setVisible] = useState(false)
  const [busy, setBusy] = useState(false)
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!shouldShowPushSoftPrompt(vapidPublicKey)) return

      getCurrentPushSubscription()
        .then((subscription) => {
          if (cancelled) return
          const stored = readPersistedPushReminderSettings()
          if (subscription) {
            persistPushReminderSettings(true, stored.interval)
            return
          }
          if (!stored.enabled) setVisible(true)
        })
        .catch(() => {
          if (!cancelled) setVisible(true)
        })
    })

    return () => {
      cancelled = true
    }
  }, [vapidPublicKey])

  async function onEnable() {
    setBusy(true)
    postponePushSoftPrompt()

    try {
      const stored = readPersistedPushReminderSettings()
      const permission = await requestNotificationPermission()
      if (permission !== 'granted') {
        persistPushReminderSettings(false, stored.interval)
        setVisible(false)
        return
      }

      const subscription = await subscribeBrowserToPush(vapidPublicKey)
      await saveSubscription(subscription, stored.interval)
      persistPushReminderSettings(true, stored.interval)
      setVisible(false)
    } catch {
      setVisible(false)
    } finally {
      setBusy(false)
    }
  }

  function onLater() {
    postponePushSoftPrompt()
    setVisible(false)
  }

  if (!visible) return null

  return (
    <section className="fixed inset-x-3 bottom-24 z-30 mx-auto max-w-lg rounded-xl border border-gold/30 bg-surface/95 p-4 shadow-lg backdrop-blur md:bottom-6" aria-live="polite">
      <p className="text-sm font-semibold text-primary">{title}</p>
      <p className="mt-1 text-sm text-muted">{body}</p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="btn-primary" onClick={onEnable} disabled={busy}>{busy ? `${enableLabel}...` : enableLabel}</button>
        <button type="button" className="btn-secondary" onClick={onLater} disabled={busy}>{laterLabel}</button>
      </div>
    </section>
  )
}

async function saveSubscription(subscription: PushSubscription, reminderInterval: ReminderInterval) {
  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      reminderInterval,
      timezone: getBrowserTimeZone(),
    }),
  })

  if (!response.ok) {
    throw new Error('The subscription could not be saved.')
  }
}


