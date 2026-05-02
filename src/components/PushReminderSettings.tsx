'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  getBrowserTimeZone,
  getCurrentPushSubscription,
  isPushSupported,
  persistPushReminderSettings,
  readPersistedPushReminderSettings,
  requestNotificationPermission,
  subscribeBrowserToPush,
  unsubscribeBrowserFromPush,
} from '@/lib/push/client'
import type { ReminderInterval } from '@/lib/push/reminders'

type SupportState = 'checking' | 'supported' | 'unsupported'

const intervalLabels: Record<ReminderInterval, string> = {
  '2h': 'Every 2 hours',
  '6h': 'Every 6 hours',
  daily: 'Daily',
}

export function PushReminderSettings() {
  const [supportState, setSupportState] = useState<SupportState>('checking')
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [enabled, setEnabled] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState<ReminderInterval>('daily')
  const [isIOS, setIsIOS] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
  const supported = supportState === 'supported'
  const statusText = useMemo(() => {
    if (supportState === 'checking') return 'Checking support'
    return supported ? 'Push reminders are supported in this browser.' : 'Push reminders are not supported in this browser.'
  }, [supportState, supported])

  useEffect(() => {
    queueMicrotask(() => {
      const pushSupported = isPushSupported()
      setSupportState(pushSupported ? 'supported' : 'unsupported')
      setIsIOS(isIOSDevice())

      if (!pushSupported) return

      const stored = readPersistedPushReminderSettings()
      setSelectedInterval(stored.interval)
      setEnabled(stored.enabled)
      setPermission(Notification.permission)

      getCurrentPushSubscription()
        .then((subscription) => {
          const nextEnabled = Boolean(subscription)
          setEnabled(nextEnabled)
          persistPushReminderSettings(nextEnabled, stored.interval)
        })
        .catch(() => undefined)
    })
  }, [])

  async function onIntervalChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextInterval = event.target.value as ReminderInterval
    setSelectedInterval(nextInterval)
    persistPushReminderSettings(enabled, nextInterval)

    if (!enabled) return

    setIsBusy(true)
    setMessage(null)

    try {
      const subscription = await getCurrentPushSubscription()
      if (!subscription) {
        setEnabled(false)
        persistPushReminderSettings(false, nextInterval)
        return
      }

      await saveSubscription(subscription, nextInterval)
      setMessage('Reminder interval updated.')
    } catch {
      setMessage('The reminder interval could not be updated right now.')
    } finally {
      setIsBusy(false)
    }
  }

  async function enableReminders() {
    if (!supported || !vapidPublicKey) return

    setIsBusy(true)
    setMessage(null)

    try {
      const nextPermission = permission === 'granted' ? 'granted' : await requestNotificationPermission()
      setPermission(nextPermission)

      if (nextPermission !== 'granted') {
        setEnabled(false)
        persistPushReminderSettings(false, selectedInterval)
        setMessage(nextPermission === 'denied'
          ? 'Notification permission is blocked in this browser.'
          : 'Notification permission was not granted.')
        return
      }

      const subscription = await subscribeBrowserToPush(vapidPublicKey)
      await saveSubscription(subscription, selectedInterval)

      setEnabled(true)
      persistPushReminderSettings(true, selectedInterval)
      setMessage('Learning reminders are enabled.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Learning reminders could not be enabled.')
    } finally {
      setIsBusy(false)
    }
  }

  async function disableReminders() {
    setIsBusy(true)
    setMessage(null)

    try {
      const endpoint = await unsubscribeBrowserFromPush()
      if (endpoint) {
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint }),
        })
      }

      setEnabled(false)
      persistPushReminderSettings(false, selectedInterval)
      setMessage('Learning reminders are disabled.')
    } catch {
      setEnabled(false)
      persistPushReminderSettings(false, selectedInterval)
      setMessage('Reminders were disabled in this browser. Server cleanup may finish on the next send attempt.')
    } finally {
      setIsBusy(false)
    }
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

  return (
    <section className="rounded-lg border border-white/10 bg-surface p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Native push reminders</h2>
          <p className="mt-1 text-sm text-muted">{statusText}</p>
          {isIOS ? (
            <p className="mt-2 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold-soft">
              Web Push on iPhone requires the app to be added to the Home Screen.
            </p>
          ) : null}
        </div>
        <p className={enabled ? 'text-sm font-semibold text-success' : 'text-sm font-semibold text-muted'}>
          {enabled ? 'Enabled' : 'Disabled'}
        </p>
      </div>

      <label className="mt-5 block text-sm text-muted" htmlFor="push-reminder-interval">Reminder interval</label>
      <select
        id="push-reminder-interval"
        className="mt-2 field"
        value={selectedInterval}
        onChange={onIntervalChange}
        disabled={!supported || isBusy}
      >
        <option value="2h" disabled>{intervalLabels['2h']}</option>
        <option value="6h" disabled>{intervalLabels['6h']}</option>
        <option value="daily">{intervalLabels.daily}</option>
      </select>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary" type="button" onClick={enableReminders} disabled={!supported || !vapidPublicKey || isBusy || enabled}>
          {isBusy && !enabled ? 'Enabling...' : 'Enable reminders'}
        </button>
        <button className="btn-secondary" type="button" onClick={disableReminders} disabled={!supported || isBusy || !enabled}>
          {isBusy && enabled ? 'Disabling...' : 'Disable reminders'}
        </button>
      </div>

      {!vapidPublicKey && supported ? (
        <p className="mt-4 text-sm text-danger">The VAPID public key is not configured.</p>
      ) : null}
      {permission === 'denied' ? (
        <p className="mt-4 text-sm text-danger">Notification permission is denied. Change the browser permission to enable reminders.</p>
      ) : null}
      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
    </section>
  )
}

function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}
