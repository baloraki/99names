import type { ReminderInterval } from './reminders'

const serviceWorkerPath = '/sw.js'
const pushEnabledKey = '99names.pushReminders.enabled'
const pushIntervalKey = '99names.pushReminders.interval'
const pushPromptNextEligibleAtKey = '99names.pushReminders.softPrompt.nextEligibleAt'
const pwaPromptDeferredKey = '99names.pwa.promptDeferred'

const PUSH_EXPLICIT_NO_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000 // 7 days after explicit "No"
const PROGRESS_STORAGE_KEY = 'app:v1:progress'
const PROGRESS_THRESHOLD_PERCENT = 5 // show prompts after 5% progress (≥5 of 99 names)

// Global variable to store the beforeinstallprompt event
let deferredPwaPrompt: BeforeInstallPromptEvent | null = null
const pwaInstallableListeners: Set<() => void> = new Set()

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

export type PushDiagnostics = {
  notificationApiAvailable: boolean
  notificationPermission: NotificationPermission | null
  permissionsApiSupported: boolean
  permissionsApiNotificationState: PermissionState | 'unsupported' | null
  serviceWorkerSupported: boolean
  pushManagerSupported: boolean
  serviceWorkerReady: boolean
  serviceWorkerScope: string | null
  hasPushSubscription: boolean
  pushEndpoint: string | null
  pushPermissionState: PermissionState | 'unsupported' | null
  userAgent: string
  likelySystemLevelIssue: boolean
  issues: string[]
}

export async function getPushDiagnostics(): Promise<PushDiagnostics> {
  const notificationApiAvailable = typeof Notification !== 'undefined'
  const serviceWorkerSupported = typeof navigator !== 'undefined' && typeof navigator.serviceWorker !== 'undefined'
  const pushManagerSupported = typeof window !== 'undefined' && typeof window.PushManager !== 'undefined'
  const permissionsApiSupported = typeof navigator !== 'undefined' && 'permissions' in navigator

  const diagnostics: PushDiagnostics = {
    notificationApiAvailable,
    notificationPermission: notificationApiAvailable ? Notification.permission : null,
    permissionsApiSupported,
    permissionsApiNotificationState: permissionsApiSupported ? null : 'unsupported',
    serviceWorkerSupported,
    pushManagerSupported,
    serviceWorkerReady: false,
    serviceWorkerScope: null,
    hasPushSubscription: false,
    pushEndpoint: null,
    pushPermissionState: pushManagerSupported ? null : 'unsupported',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    likelySystemLevelIssue: false,
    issues: [],
  }

  try {
    if (permissionsApiSupported) {
      const status = await navigator.permissions.query({ name: 'notifications' as PermissionName })
      diagnostics.permissionsApiNotificationState = status.state
    }
  } catch {
    diagnostics.permissionsApiNotificationState = null
  }

  if (diagnostics.notificationPermission === 'denied') {
    diagnostics.issues.push('notifications-denied')
  } else if (diagnostics.notificationPermission !== 'granted') {
    diagnostics.issues.push('notifications-not-granted')
  }

  if (!serviceWorkerSupported) {
    diagnostics.issues.push('service-worker-unsupported')
    return diagnostics
  }

  if (!pushManagerSupported) {
    diagnostics.issues.push('push-manager-unsupported')
    return diagnostics
  }

  try {
    const registration = await navigator.serviceWorker.ready
    diagnostics.serviceWorkerReady = true
    diagnostics.serviceWorkerScope = registration.scope

    const subscription = await registration.pushManager.getSubscription()
    diagnostics.hasPushSubscription = Boolean(subscription)
    diagnostics.pushEndpoint = subscription?.endpoint ?? null

    if (typeof registration.pushManager.permissionState === 'function') {
      diagnostics.pushPermissionState = await registration.pushManager.permissionState({ userVisibleOnly: true })
    } else {
      diagnostics.pushPermissionState = 'unsupported'
    }
  } catch {
    diagnostics.issues.push('service-worker-not-ready')
  }

  if (!diagnostics.hasPushSubscription) {
    diagnostics.issues.push('missing-subscription')
  }
  if (diagnostics.pushPermissionState === 'denied') {
    diagnostics.issues.push('push-permission-denied')
  }

  const appearsTechnicallyHealthy =
    diagnostics.notificationPermission === 'granted' &&
    diagnostics.hasPushSubscription &&
    diagnostics.serviceWorkerReady &&
    diagnostics.pushPermissionState !== 'denied'

  if (appearsTechnicallyHealthy) {
    diagnostics.likelySystemLevelIssue = true
    diagnostics.issues.push('system-level-settings-may-block-notifications')
  }

  return diagnostics
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

/** Call this only when the user explicitly clicks "No / Not now". Sets a 7-day cooldown. */
export function postponePushSoftPrompt(now = Date.now()): void {
  try {
    window.localStorage.setItem(pushPromptNextEligibleAtKey, String(now + PUSH_EXPLICIT_NO_COOLDOWN_MS))
  } catch {
    // localStorage can be unavailable in private modes or strict browser settings.
  }
}

// Capture the beforeinstallprompt event at module load time
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event: Event) => {
    // Prevent the browser's default install prompt
    event.preventDefault()
    // Store the event for later use
    deferredPwaPrompt = event as BeforeInstallPromptEvent
    // Notify all subscribers
    for (const listener of pwaInstallableListeners) {
      listener()
    }
  })
}

// ── Learning progress threshold ───────────────────────────────────────────────
/** Returns true once the user has learned ≥5% of the 99 names (≥5 names). */
export function hasEnoughLearningProgress(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { learnedIds?: unknown }
    if (!Array.isArray(parsed.learnedIds)) return false
    const percent = (parsed.learnedIds.length / 99) * 100
    return percent >= PROGRESS_THRESHOLD_PERCENT
  } catch {
    return false
  }
}

export function isPwaInstallable(): boolean {
  return deferredPwaPrompt !== null
}

/** Subscribe to be notified when the PWA becomes installable. Returns an unsubscribe function. */
export function subscribeToPwaInstallable(callback: () => void): () => void {
  pwaInstallableListeners.add(callback)
  return () => pwaInstallableListeners.delete(callback)
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
