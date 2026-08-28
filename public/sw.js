const CACHE = 'work-receipt-shell-v3'
const ASSET_CACHE = 'work-receipt-assets-v3'
const SHELL = ['/', '/index.html', '/offline.html', '/manifest.webmanifest', '/icons/icon-192.png', '/icons/icon-512.png', '/assets/hero-notebook-720.webp', '/assets/hero-notebook-1200.webp', '/privacy/', '/terms/']

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
      const cache = await caches.open(CACHE)
      await cache.addAll(SHELL)
    const response = await fetch('/index.html')
    const html = await response.text()
    const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)].map((match) => match[1])
    await cache.addAll(assets)
    await self.skipWaiting()
  })())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE && key !== ASSET_CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()))
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then((response) => {
      const copy = response.clone()
      caches.open(CACHE).then((cache) => cache.put(request, copy))
      return response
    }).catch(async () => (await caches.match(request, { ignoreVary: true })) || (await caches.match('/index.html', { ignoreVary: true })) || caches.match('/offline.html')))
    return
  }

  event.respondWith(caches.match(request, { ignoreVary: true, ignoreSearch: true }).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) caches.open(ASSET_CACHE).then((cache) => cache.put(request, response.clone()))
    return response
  })))
})
