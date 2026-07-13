/* Jeevan HealthCare service worker — PWA install + push */
const CACHE = 'jeevan-shell-v4';
const SHELL = [
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL).catch(() => undefined))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Never cache API
  if (url.pathname.startsWith('/api')) return;
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  // Navigations (and the root document) are network-first so the browser
  // always receives the FRESH index.html with current hashed chunk names.
  // A cached old index.html would reference chunks that no longer exist
  // after a deploy, causing module/MIME load failures.
  if (request.mode === 'navigate' || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE).then((c) => c.put(request, copy));
          return resp;
        })
        .catch(() => caches.match(request).then((c) => c || caches.match('/')))
    );
    return;
  }

  // Hashed static assets are immutable: cache-first, but NEVER cache a
  // non-OK or HTML (error/fallback) response — that would poison the cache
  // and reproduce the "MIME type text/html" module load failure.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((resp) => {
          const type = resp.headers.get('content-type') || '';
          if (resp.ok && !type.includes('text/html')) {
            const copy = resp.clone();
            caches.open(CACHE).then((c) => c.put(request, copy));
          }
          return resp;
        })
        .catch(() => caches.match('/'));
    })
  );
});

self.addEventListener('push', (event) => {
  let data = { title: 'Jeevan HealthCare', body: 'You have a new update', url: '/dashboard?tab=reports' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    try {
      data.body = event.data.text();
    } catch { /* ignore */ }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Jeevan HealthCare', {
      body: data.body,
      icon: '/logo.png',
      badge: '/favicon.png',
      tag: data.tag || 'jeevan-notify',
      data: { url: data.url || '/dashboard?tab=reports' },
      vibrate: [120, 60, 120],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/dashboard?tab=reports';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
      return undefined;
    })
  );
});
