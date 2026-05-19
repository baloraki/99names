'use client'

import type { ChangeEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  getBrowserTimeZone,
  getCurrentPushSubscription,
  isIOSDevice,
  isPushSupported,
  persistPushReminderSettings,
  readPersistedPushReminderSettings,
  requestNotificationPermission,
  subscribeBrowserToPush,
  unsubscribeBrowserFromPush,
} from '@/lib/push/client'
import type { ReminderInterval } from '@/lib/push/reminders'
import type { Language } from '@/types/language'

type SupportState = 'checking' | 'supported' | 'unsupported'

const intervalLabels: Record<ReminderInterval, string> = {
  '2h': 'Every 2 hours',
  '6h': 'Every 6 hours',
  daily: 'Daily',
}

export function PushReminderSettings({
  title,
  iosPushUnavailable,
  iosPwaNote,
  locale,
}: {
  title: string
  iosPushUnavailable: string
  iosPwaNote: string
  locale: Language
}) {
  const [supportState, setSupportState] = useState<SupportState>('checking')
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [enabled, setEnabled] = useState(false)
  const [selectedInterval, setSelectedInterval] = useState<ReminderInterval>('daily')
  const [isIOS, setIsIOS] = useState(false)
  const [isBusy, setIsBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''
  const supported = supportState === 'supported'
  const pushUnavailableOnIOS = isIOS
  const controlsDisabled = !supported || pushUnavailableOnIOS || isBusy
  const statusLabel = enabled && !pushUnavailableOnIOS ? 'Enabled' : 'Disabled'
  const statusText = useMemo(() => {
    if (supportState === 'checking') return 'Checking support'
    if (pushUnavailableOnIOS) return iosPushUnavailable
    return supported ? 'Push reminders are supported in this browser.' : 'Push reminders are not supported in this browser.'
  }, [iosPushUnavailable, pushUnavailableOnIOS, supportState, supported])

  useEffect(() => {
    queueMicrotask(() => {
      const pushSupported = isPushSupported()
      const iosDevice = isIOSDevice()
      setSupportState(pushSupported ? 'supported' : 'unsupported')
      setIsIOS(iosDevice)

      const stored = readPersistedPushReminderSettings()
      setSelectedInterval(stored.interval)

      if (iosDevice) {
        setEnabled(false)
        persistPushReminderSettings(false, stored.interval)
        if (typeof Notification !== 'undefined') setPermission(Notification.permission)
        return
      }

      if (!pushSupported) return

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
    if (pushUnavailableOnIOS) return

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
    if (!supported || pushUnavailableOnIOS || !vapidPublicKey) return

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
    if (pushUnavailableOnIOS) return

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
        locale,
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
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted">{statusText}</p>
          {isIOS ? (
            <p className="mt-2 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm text-gold-soft">
              {iosPwaNote}
            </p>
          ) : null}
        </div>
        <p className={enabled && !pushUnavailableOnIOS ? 'text-sm font-semibold text-success' : 'text-sm font-semibold text-muted'}>
          {statusLabel}
        </p>
      </div>

      <label className={pushUnavailableOnIOS ? 'mt-5 block text-sm text-muted opacity-50' : 'mt-5 block text-sm text-muted'} htmlFor="push-reminder-interval">Reminder interval</label>
      <select
        id="push-reminder-interval"
        className={pushUnavailableOnIOS ? 'mt-2 field opacity-50' : 'mt-2 field'}
        value={selectedInterval}
        onChange={onIntervalChange}
        disabled={controlsDisabled}
      >
        <option value="2h">{intervalLabels['2h']}</option>
        <option value="6h">{intervalLabels['6h']}</option>
        <option value="daily">{intervalLabels.daily}</option>
      </select>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary disabled:opacity-50" type="button" onClick={enableReminders} disabled={!supported || pushUnavailableOnIOS || !vapidPublicKey || isBusy || enabled}>
          {isBusy && !enabled ? 'Enabling...' : 'Enable reminders'}
        </button>
        <button className="btn-secondary disabled:opacity-50" type="button" onClick={disableReminders} disabled={!supported || pushUnavailableOnIOS || isBusy || !enabled}>
          {isBusy && enabled ? 'Disabling...' : 'Disable reminders'}
        </button>
      </div>

      {!vapidPublicKey && supported && !pushUnavailableOnIOS ? (
        <p className="mt-4 text-sm text-danger">The VAPID public key is not configured.</p>
      ) : null}
      {permission === 'denied' && !pushUnavailableOnIOS ? (
        <p className="mt-4 text-sm text-danger">Notification permission is denied. Change the browser permission to enable reminders.</p>
      ) : null}
      {message ? <p className="mt-4 text-sm text-muted">{message}</p> : null}
    </section>
  )
}

