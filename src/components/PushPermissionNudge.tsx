'use client'

import { useEffect, useState } from 'react'
import type { ReminderInterval } from '@/lib/push/reminders'
import {
  getBrowserTimeZone,
  getCurrentPushSubscription,
  hasPwaPromptBeenDeferred,
  isPwaInstallable,
  isPwaInstalled,
  markPwaPromptAsDeferred,
  persistPushReminderSettings,
  postponePushSoftPrompt,
  promptPwaInstall,
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
  pwaInstallTitle,
  pwaInstallBody,
}: {
  title: string
  body: string
  enableLabel: string
  laterLabel: string
  pwaInstallTitle: string
  pwaInstallBody: string
}) {
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'push' | 'pwa'>('push')
  const [busy, setBusy] = useState(false)
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      // Check if PWA is already installed
      if (isPwaInstalled()) {
        // If PWA is installed, check for push notification prompt
        if (!shouldShowPushSoftPrompt(vapidPublicKey)) return

        const stored = readPersistedPushReminderSettings()
        if (stored.enabled) return

        // Show immediately, then hide in background if subscription already exists
        if (!cancelled) {
          setMode('push')
          setVisible(true)
        }

        getCurrentPushSubscription()
          .then((subscription) => {
            if (cancelled) return
            if (subscription) {
              persistPushReminderSettings(true, stored.interval)
              setVisible(false)
            }
          })
          .catch(() => {/* keep visible */})
      } else {
        // PWA is not installed, check if we should show PWA install prompt
        if (isPwaInstallable() && !hasPwaPromptBeenDeferred()) {
          setMode('pwa')
          setVisible(true)
        } else if (shouldShowPushSoftPrompt(vapidPublicKey)) {
          // If PWA prompt is not available or was deferred, show push prompt immediately
          const stored = readPersistedPushReminderSettings()
          if (stored.enabled) return

          if (!cancelled) {
            setMode('push')
            setVisible(true)
          }

          // Hide in background if subscription already exists
          getCurrentPushSubscription()
            .then((subscription) => {
              if (cancelled) return
              if (subscription) {
                persistPushReminderSettings(true, stored.interval)
                setVisible(false)
              }
            })
            .catch(() => {/* keep visible */})
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [vapidPublicKey])

  async function onEnablePwa() {
    setBusy(true)

    try {
      const outcome = await promptPwaInstall()

      if (outcome === 'accepted') {
        // PWA was installed successfully – wait briefly, then show push prompt
        setTimeout(() => {
          if (shouldShowPushSoftPrompt(vapidPublicKey)) {
            setMode('push')
            setVisible(true)
          } else {
            setVisible(false)
          }
        }, 1000)
      } else {
        // User dismissed – still offer push so we can contact them
        markPwaPromptAsDeferred()
        if (shouldShowPushSoftPrompt(vapidPublicKey)) {
          setMode('push')
        } else {
          setVisible(false)
        }
      }
    } catch {
      markPwaPromptAsDeferred()
      if (shouldShowPushSoftPrompt(vapidPublicKey)) {
        setMode('push')
      } else {
        setVisible(false)
      }
    } finally {
      setBusy(false)
    }
  }

  async function onEnablePush() {
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
    if (mode === 'pwa') {
      markPwaPromptAsDeferred()
      // Immediately offer push so we can still reach the user
      if (shouldShowPushSoftPrompt(vapidPublicKey)) {
        setMode('push')
        return
      }
    } else {
      postponePushSoftPrompt()
    }
    setVisible(false)
  }

  if (!visible) return null

  const displayTitle = mode === 'pwa' ? pwaInstallTitle : title
  const displayBody = mode === 'pwa' ? pwaInstallBody : body
  const onEnable = mode === 'pwa' ? onEnablePwa : onEnablePush

  return (
    <section className="fixed inset-x-3 bottom-24 z-30 mx-auto max-w-lg rounded-xl border border-gold/30 bg-surface/95 p-4 shadow-lg backdrop-blur md:bottom-6" aria-live="polite">
      <p className="text-sm font-semibold text-primary">{displayTitle}</p>
      <p className="mt-1 text-sm text-muted">{displayBody}</p>
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


