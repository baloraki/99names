import type { ReminderInterval } from './reminders'

const serviceWorkerPath = '/sw.js'

export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
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
    window.localStorage.setItem('99names.pushReminders.enabled', enabled ? 'yes' : 'no')
    window.localStorage.setItem('99names.pushReminders.interval', interval)
  } catch {
    // localStorage can be unavailable in private modes or strict browser settings.
  }
}

export function readPersistedPushReminderSettings(): { enabled: boolean; interval: ReminderInterval } {
  try {
    const enabled = window.localStorage.getItem('99names.pushReminders.enabled') === 'yes'
    const interval = window.localStorage.getItem('99names.pushReminders.interval')

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
