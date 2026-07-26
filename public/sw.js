/* Jeevan HealthCare — shared service worker (per-origin install).
 * Cache app shell for offline shell; network-first for API/navigation.
 */
const CACHE = 'jeevan-pwa-v7-1';
const PRECACHE = [
  '/',
  '/index.html',
  '/favicon.png',
  '/logo.png',
  '/manifests/patient.webmanifest',
  '/manifests/admin.webmanifest',
  '/manifests/phlebo.webmanifest',
  '/icons/patient-192.png',
  '/icons/patient-512.png',
  '/icons/admin-192.png',
  '/icons/admin-512.png',
  '/icons/phlebo-192.png',
  '/icons/phlebo-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Never cache API
  if (url.pathname.startsWith('/api') || url.hostname.includes('onrender.com')) {
    return;
  }

  // Navigations: network first, fallback to cache/index
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('/index.html', copy));
          return res;
        })
        .catch(() =>
          caches.match('/index.html').then((r) => r || caches.match('/')),
        ),
    );
    return;
  }

  // Static assets: cache first
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') ||
      url.pathname.startsWith('/icons/') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.webmanifest'))
  ) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
  }
});

// Phase 7 push hook — ready for VAPID later
self.addEventListener('push', (event) => {
  let data = { title: 'Jeevan HealthCare', body: 'You have an update' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    /* ignore */
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Jeevan HealthCare', {
      body: data.body || '',
      icon: data.icon || '/icons/patient-192.png',
      badge: '/icons/patient-192.png',
      data: data.url ? { url: data.url } : {},
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const c of list) {
        if ('focus' in c) {
          c.navigate(url);
          return c.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    }),
  );
});
