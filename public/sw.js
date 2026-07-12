/* Jeevan HealthCare service worker — PWA install + push */
const CACHE = 'jeevan-shell-v1';
const SHELL = ['/', '/manifest.webmanifest', '/logo.png', '/favicon.png'];

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
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match('/')))
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
