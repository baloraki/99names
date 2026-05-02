'use client'

import { useEffect, useState } from 'react'
import type { ReminderInterval } from '@/lib/push/reminders'
import {
  getBrowserTimeZone,
  getCurrentPushSubscription,
  hasEnoughLearningProgress,
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
  subscribeToPwaInstallable,
} from '@/lib/push/client'

export function PushPermissionNudge({
  title,
  body,
  enableLabel,
  laterLabel,
  pwaInstallTitle,
  pwaInstallBody,
  permissionGuideTitle,
  permissionGuideBody,
  permissionGuideOk,
}: {
  title: string
  body: string
  enableLabel: string
  laterLabel: string
  pwaInstallTitle: string
  pwaInstallBody: string
  permissionGuideTitle: string
  permissionGuideBody: string
  permissionGuideOk: string
}) {
  const [visible, setVisible] = useState(false)
  const [mode, setMode] = useState<'push' | 'pwa'>('push')
  const [busy, setBusy] = useState(false)
  const [awaitingPermission, setAwaitingPermission] = useState(false)
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

  useEffect(() => {
    let cancelled = false

    function decidePrompt() {
      if (cancelled) return

      if (isPwaInstalled()) {
        // PWA already installed → check push
        const stored = readPersistedPushReminderSettings()

        // Always check subscription status when push was previously enabled
        // (catches lost/expired subscriptions)
        if (stored.enabled) {
          getCurrentPushSubscription()
            .then((subscription) => {
              if (cancelled) return
              if (!subscription) {
                // Subscription was lost – re-prompt immediately
                setMode('push')
                setVisible(true)
              }
            })
            .catch(() => {/* ignore */})
          return
        }

        // Not previously enabled – show soft prompt if cooldown passed
        if (!shouldShowPushSoftPrompt(vapidPublicKey)) return

        setMode('push')
        setVisible(true)

        getCurrentPushSubscription()
          .then((subscription) => {
            if (cancelled) return
            if (subscription) {
              persistPushReminderSettings(true, stored.interval)
              setVisible(false)
            }
          })
          .catch(() => {/* keep visible */})
      } else if (isPwaInstallable() && !hasPwaPromptBeenDeferred()) {
        // PWA installable and not yet deferred → ask first
        setMode('pwa')
        setVisible(true)
      } else if (shouldShowPushSoftPrompt(vapidPublicKey)) {
        // No PWA prompt available → fall back to push
        const stored = readPersistedPushReminderSettings()
        if (stored.enabled) return

        setMode('push')
        setVisible(true)

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

    function scheduleDecide() {
      if (hasEnoughLearningProgress()) {
        queueMicrotask(decidePrompt)
        return undefined
      }
      // Not enough progress yet – poll every 5 s until threshold is reached
      const interval = setInterval(() => {
        if (cancelled) {
          clearInterval(interval)
          return
        }
        if (hasEnoughLearningProgress()) {
          clearInterval(interval)
          decidePrompt()
        }
      }, 5_000)
      return interval
    }

    const interval = scheduleDecide()

    // Also subscribe: if beforeinstallprompt fires late, switch to PWA prompt
    // but only if the 5% progress threshold is already met
    const unsubscribe = subscribeToPwaInstallable(() => {
      if (cancelled) return
      if (hasEnoughLearningProgress() && !hasPwaPromptBeenDeferred() && !isPwaInstalled()) {
        setMode('pwa')
        setVisible(true)
      }
    })

    return () => {
      cancelled = true
      if (interval) clearInterval(interval)
      unsubscribe()
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
    setVisible(false)
    setAwaitingPermission(true)

    try {
      const stored = readPersistedPushReminderSettings()
      const permission = await requestNotificationPermission()
      setAwaitingPermission(false)

      if (permission !== 'granted') {
        persistPushReminderSettings(false, stored.interval)
        return
      }

      const subscription = await subscribeBrowserToPush(vapidPublicKey)
      await saveSubscription(subscription, stored.interval)
      persistPushReminderSettings(true, stored.interval)
    } catch {
      setAwaitingPermission(false)
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

  if (awaitingPermission) {
    return (
      <div className="fixed inset-x-3 top-0 z-50 flex justify-center pointer-events-none">
        {/* Arrow pointing up toward the browser dialog */}
        <div className="pointer-events-auto mt-16 w-full max-w-sm rounded-xl border border-gold/40 bg-surface/95 p-4 shadow-xl backdrop-blur">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-gold text-2xl leading-none">▲</div>
          <p className="text-sm font-semibold text-primary">{permissionGuideTitle}</p>
          <p className="mt-1 text-sm text-muted">{permissionGuideBody}</p>
          <button
            type="button"
            className="btn-primary mt-3"
            onClick={() => setAwaitingPermission(false)}
          >
            {permissionGuideOk}
          </button>
        </div>
      </div>
    )
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


