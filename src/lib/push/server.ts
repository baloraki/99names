import 'server-only'

import webPush, { type PushSubscription } from 'web-push'

export type PushReminderPayload = {
  title: string
  body: string
  url: string
  icon?: string
  badge?: string
}

let configured = false

export function assertPushServerConfigured(): void {
  configureWebPush()
}

export async function sendPushNotification(
  subscription: PushSubscription,
  payload: PushReminderPayload
): Promise<void> {
  configureWebPush()

  await webPush.sendNotification(subscription, JSON.stringify({
    icon: '/icon-192.png',
    badge: '/maskable-icon-512.png',
    ...payload,
  }))
}

function configureWebPush(): void {
  if (configured) return

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT

  if (!publicKey || !privateKey || !subject) {
    throw new Error('Missing VAPID environment variables.')
  }

  webPush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
}
