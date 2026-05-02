import type { ReminderInterval } from './reminders'

const serviceWorkerPath = '/sw.js'
const pushEnabledKey = '99names.pushReminders.enabled'
const pushIntervalKey = '99names.pushReminders.interval'
const pushPromptNextEligibleAtKey = '99names.pushReminders.softPrompt.nextEligibleAt'
const pwaPromptDeferredKey = '99names.pwa.promptDeferred'

const DAY_IN_MS = 24 * 60 * 60 * 1000
const PUSH_SOFT_PROMPT_COOLDOWN_DAYS = 30
const PUSH_SOFT_PROMPT_COOLDOWN_MS = PUSH_SOFT_PROMPT_COOLDOWN_DAYS * DAY_IN_MS

// Global variable to store the beforeinstallprompt event
let deferredPwaPrompt: BeforeInstallPromptEvent | null = null

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

export function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false

  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser.')
  }

  return navigator.serviceWorker.register(serviceWorkerPath, {
    scope: '/',
    updateViaCache: 'none',
  })
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length))

  for (let index = 0; index < rawData.length; index += 1) {
    outputArray[index] = rawData.charCodeAt(index)
  }

  return outputArray
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser.')
  }

  return Notification.requestPermission()
}

export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  const registration = await registerPushServiceWorker()
  return registration.pushManager.getSubscription()
}

export async function subscribeBrowserToPush(vapidPublicKey: string): Promise<PushSubscription> {
  if (!vapidPublicKey) {
    throw new Error('The VAPID public key is not configured.')
  }

  const registration = await registerPushServiceWorker()
  const existingSubscription = await registration.pushManager.getSubscription()
  if (existingSubscription) return existingSubscription

  return registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  })
}

export async function unsubscribeBrowserFromPush(): Promise<string | null> {
  const subscription = await getCurrentPushSubscription()
  if (!subscription) return null

  const { endpoint } = subscription
  await subscription.unsubscribe()
  return endpoint
}

export function getBrowserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

export function persistPushReminderSettings(enabled: boolean, interval: ReminderInterval): void {
  try {
    window.localStorage.setItem(pushEnabledKey, enabled ? 'yes' : 'no')
    window.localStorage.setItem(pushIntervalKey, interval)
  } catch {
    // localStorage can be unavailable in private modes or strict browser settings.
  }
}

export function readPersistedPushReminderSettings(): { enabled: boolean; interval: ReminderInterval } {
  try {
    const enabled = window.localStorage.getItem(pushEnabledKey) === 'yes'
    const interval = window.localStorage.getItem(pushIntervalKey)

    return {
      enabled,
      interval: interval === '2h' || interval === '6h' || interval === 'daily' ? interval : 'daily',
    }
  } catch {
    return {
      enabled: false,
      interval: 'daily',
    }
  }
}

export function shouldShowPushSoftPrompt(vapidPublicKey: string, now = Date.now()): boolean {
  if (!vapidPublicKey) return false
  if (!isPushSupported() || isIOSDevice()) return false
  if (typeof Notification === 'undefined' || Notification.permission !== 'default') return false

  try {
    const nextEligibleAt = Number(window.localStorage.getItem(pushPromptNextEligibleAtKey) ?? '0')
    if (!Number.isFinite(nextEligibleAt)) return true
    return nextEligibleAt <= now
  } catch {
    return true
  }
}

export function postponePushSoftPrompt(now = Date.now()): void {
  try {
    window.localStorage.setItem(pushPromptNextEligibleAtKey, String(now + PUSH_SOFT_PROMPT_COOLDOWN_MS))
  } catch {
    // localStorage can be unavailable in private modes or strict browser settings.
  }
}

// PWA Installation functions
// Capture the beforeinstallprompt event at module load time
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    // Prevent the browser's default install prompt
    event.preventDefault()
    // Store the event for later use
    deferredPwaPrompt = event as BeforeInstallPromptEvent
  })
}

export function isPwaInstallable(): boolean {
  return deferredPwaPrompt !== null
}

export function isPwaInstalled(): boolean {
  if (typeof window === 'undefined') return false
  if (typeof window.matchMedia !== 'function') return false

  // Check if app is running in standalone mode (installed PWA)
  const nav = window.navigator as { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true || // iOS Safari
    document.referrer.includes('android-app://')
  )
}

export async function promptPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  if (!deferredPwaPrompt) {
    return 'unavailable'
  }

  try {
    // Show the install prompt
    await deferredPwaPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPwaPrompt.userChoice

    // Clear the deferred prompt
    deferredPwaPrompt = null

    return outcome
  } catch {
    return 'dismissed'
  }
}

export function hasPwaPromptBeenDeferred(): boolean {
  try {
    return window.localStorage.getItem(pwaPromptDeferredKey) === 'yes'
  } catch {
    return false
  }
}

export function markPwaPromptAsDeferred(): void {
  try {
    window.localStorage.setItem(pwaPromptDeferredKey, 'yes')
  } catch {
    // localStorage can be unavailable in private modes or strict browser settings.
  }
}

