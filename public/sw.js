const CACHE_NAME = '99names-app-shell-v3'
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
  '/tr',
  '/tr/esmaul-husna',
  '/tr/ogren',
  '/tr/dua',
  '/tr/tefekkur',
  '/tr/quiz',
  '/tr/esmaul-husna-nedir',
  '/settings',
  '/privacy',
  '/imprint',
  '/offline',
  '/manifest.webmanifest',
  '/logo.svg',
  '/icon.svg',
  '/maskable-icon.svg'
]

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
