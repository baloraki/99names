import { afterEach, describe, expect, it } from 'vitest'
import { postponePushSoftPrompt, shouldShowPushSoftPrompt } from './client'

const originalServiceWorker = navigator.serviceWorker
const originalPushManager = (window as Window & { PushManager?: unknown }).PushManager
const originalNotification = (window as Window & { Notification?: unknown }).Notification
const originalNavigatorPlatform = navigator.platform
const originalNavigatorMaxTouchPoints = navigator.maxTouchPoints

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

