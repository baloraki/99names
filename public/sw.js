const CACHE_NAME = '99names-app-shell-v5'
const APP_SHELL = [
  '/',
  '/names',
  '/learn',
  '/quiz',
  '/dua',
  '/reflections',
  '/asma-ul-husna',
  '/de',
  '/de/namen',
  '/de/lernen',
  '/de/dua',
  '/de/reflexionen',
  '/de/quiz',
  '/de/asma-ul-husna',
  '/de/einstellungen',
  '/tr',
  '/tr/esmaul-husna',
  '/tr/ogren',
  '/tr/dua',
  '/tr/tefekkur',
  '/tr/quiz',
  '/tr/esmaul-husna-nedir',
  '/tr/ayarlar',
  '/settings',
  '/privacy',
  '/imprint',
  '/offline',
  '/manifest.webmanifest',
  '/logo.svg',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon.svg',
  '/maskable-icon-512.png'
]

const DEFAULT_NOTIFICATION = {
  title: 'Zeit zum Lernen',
  body: 'Wiederhole heute einen Namen Allahs.',
  icon: '/icon.svg',
  badge: '/maskable-icon.svg',
  url: '/learn#learn-now'
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/')) return

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          return response
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/offline')))
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) return response
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
        return response
      })
    })
  )
})

self.addEventListener('push', (event) => {
  const data = readPushPayload(event)
  const title = readString(data.title, DEFAULT_NOTIFICATION.title)
  const options = {
    body: readString(data.body, DEFAULT_NOTIFICATION.body),
    icon: readString(data.icon, DEFAULT_NOTIFICATION.icon),
    badge: readString(data.badge, DEFAULT_NOTIFICATION.badge),
    data: {
      url: readNotificationUrl(data.url)
    }
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('sync', (event) => {
  // Placeholder for future background sync logic (e.g. syncing progress to server)
  if (event.tag === 'sync-progress') {
    event.waitUntil(Promise.resolve())
  }
})

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(
      self.registration.showNotification(DEFAULT_NOTIFICATION.title, {
        body: DEFAULT_NOTIFICATION.body,
        icon: DEFAULT_NOTIFICATION.icon,
        badge: DEFAULT_NOTIFICATION.badge,
        data: { url: DEFAULT_NOTIFICATION.url }
      })
    )
  }
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  const targetUrl = readNotificationUrl(event.notification.data && event.notification.data.url)

  event.waitUntil((async () => {
    const windowClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })

    for (const client of windowClients) {
      const clientUrl = new URL(client.url)
      if (clientUrl.origin !== self.location.origin) continue

      if ('navigate' in client) {
        await client.navigate(targetUrl)
      }

      if ('focus' in client) {
        return client.focus()
      }
    }

    return clients.openWindow(targetUrl)
  })())
})

function readPushPayload(event) {
  if (!event.data) return DEFAULT_NOTIFICATION

  try {
    const json = event.data.json()
    return json && typeof json === 'object' ? json : DEFAULT_NOTIFICATION
  } catch {
    try {
      return {
        ...DEFAULT_NOTIFICATION,
        body: event.data.text()
      }
    } catch {
      return DEFAULT_NOTIFICATION
    }
  }
}

function readString(value, fallback) {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback
}

function readNotificationUrl(value) {
  const fallback = new URL(DEFAULT_NOTIFICATION.url, self.location.origin).href
  if (typeof value !== 'string' || value.trim().length === 0) return fallback

  try {
    const url = new URL(value, self.location.origin)
    return url.origin === self.location.origin ? url.href : fallback
  } catch {
    return fallback
  }
}
