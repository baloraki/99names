import { afterEach, describe, expect, it } from 'vitest'
import { getPushDiagnostics, postponePushSoftPrompt, shouldShowPushSoftPrompt } from './client'

const originalServiceWorker = navigator.serviceWorker
const originalPushManager = (window as Window & { PushManager?: unknown }).PushManager
const originalNotification = (window as Window & { Notification?: unknown }).Notification
const originalNavigatorPlatform = navigator.platform
const originalNavigatorMaxTouchPoints = navigator.maxTouchPoints
const originalPermissions = (navigator as Navigator & { permissions?: unknown }).permissions

function mockSupportedBrowser(permission: NotificationPermission = 'default') {
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: {},
  })

  Object.defineProperty(window, 'PushManager', {
    configurable: true,
    value: class PushManager {},
  })

  Object.defineProperty(window, 'Notification', {
    configurable: true,
    value: { permission },
  })

  Object.defineProperty(navigator, 'platform', {
    configurable: true,
    value: 'Linux x86_64',
  })

  Object.defineProperty(navigator, 'maxTouchPoints', {
    configurable: true,
    value: 0,
  })
}

function mockReadyServiceWorker(subscription: PushSubscription | null, permissionState: PermissionState = 'granted') {
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: {
      ready: Promise.resolve({
        scope: '/',
        pushManager: {
          getSubscription: async () => subscription,
          permissionState: async () => permissionState,
        },
      }),
    },
  })
}

afterEach(() => {
  window.localStorage.clear()

  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: originalServiceWorker,
  })
  Object.defineProperty(window, 'PushManager', {
    configurable: true,
    value: originalPushManager,
  })
  Object.defineProperty(window, 'Notification', {
    configurable: true,
    value: originalNotification,
  })
  Object.defineProperty(navigator, 'platform', {
    configurable: true,
    value: originalNavigatorPlatform,
  })
  Object.defineProperty(navigator, 'maxTouchPoints', {
    configurable: true,
    value: originalNavigatorMaxTouchPoints,
  })
  Object.defineProperty(navigator, 'permissions', {
    configurable: true,
    value: originalPermissions,
  })
})

describe('push soft prompt', () => {
  it('shows on first visit when browser supports push and permission is default', () => {
    mockSupportedBrowser('default')

    expect(shouldShowPushSoftPrompt('test-vapid-key')).toBe(true)
  })

  it('shows again on next visit without explicit no (no cooldown)', () => {
    mockSupportedBrowser('default')

    expect(shouldShowPushSoftPrompt('test-vapid-key')).toBe(true)
    expect(shouldShowPushSoftPrompt('test-vapid-key')).toBe(true)
  })

  it('does not show for 7 days after explicit "No", then shows again', () => {
    mockSupportedBrowser('default')

    postponePushSoftPrompt(1_000)

    expect(shouldShowPushSoftPrompt('test-vapid-key', 1_000 + 6 * 24 * 60 * 60 * 1000)).toBe(false)
    expect(shouldShowPushSoftPrompt('test-vapid-key', 1_000 + 7 * 24 * 60 * 60 * 1000)).toBe(true)
  })

  it('does not show when notification permission is already denied', () => {
    mockSupportedBrowser('denied')

    expect(shouldShowPushSoftPrompt('test-vapid-key')).toBe(false)
  })
})

describe('getPushDiagnostics', () => {
  it('handles missing Notification API', async () => {
    Object.defineProperty(window, 'Notification', { configurable: true, value: undefined })
    const result = await getPushDiagnostics()
    expect(result.notificationApiAvailable).toBe(false)
    expect(result.issues).toContain('notifications-not-granted')
  })

  it('reports permission denied', async () => {
    mockSupportedBrowser('denied')
    mockReadyServiceWorker(null)
    const result = await getPushDiagnostics()
    expect(result.notificationPermission).toBe('denied')
    expect(result.issues).toContain('notifications-denied')
  })

  it('reports service worker unsupported', async () => {
    Object.defineProperty(navigator, 'serviceWorker', { configurable: true, value: undefined })
    const result = await getPushDiagnostics()
    expect(result.serviceWorkerSupported).toBe(false)
    expect(result.issues).toContain('service-worker-unsupported')
  })

  it('reports PushManager unsupported', async () => {
    mockSupportedBrowser('default')
    Object.defineProperty(window, 'PushManager', { configurable: true, value: undefined })
    const result = await getPushDiagnostics()
    expect(result.pushManagerSupported).toBe(false)
    expect(result.issues).toContain('push-manager-unsupported')
  })

  it('returns healthy subscription state when granted and subscribed', async () => {
    mockSupportedBrowser('granted')
    mockReadyServiceWorker({ endpoint: 'https://example.com/sub' } as PushSubscription)
    const result = await getPushDiagnostics()
    expect(result.hasPushSubscription).toBe(true)
    expect(result.pushEndpoint).toBe('https://example.com/sub')
    expect(result.likelySystemLevelIssue).toBe(true)
    expect(result.issues).toContain('system-level-settings-may-block-notifications')
  })

  it('reports missing subscription after previously enabled', async () => {
    mockSupportedBrowser('granted')
    window.localStorage.setItem('99names.pushReminders.enabled', 'yes')
    mockReadyServiceWorker(null)
    const result = await getPushDiagnostics()
    expect(result.hasPushSubscription).toBe(false)
    expect(result.issues).toContain('missing-subscription')
  })
})
