// MH ESPORTS PWA Service Worker v1.0.0
const CACHE_NAME = 'mh-esports-cache-v1';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/mh_esports_logo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Let Firebase, Google APIs, and external CDNs bypass SW cache
  const url = new URL(event.request.url);
  if (
    event.request.method !== 'GET' ||
    url.origin.includes('firestore.googleapis.com') ||
    url.origin.includes('identitytoolkit.googleapis.com') ||
    url.origin.includes('firebaseio.com') ||
    url.origin.includes('qrserver.com')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cache but update in background
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse.clone()));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).catch(() => {
        // Fallback to cached root
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});

// Mobile Notification Click Handler (opens/focuses app when notification is tapped)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const clickAction = event.action;
  const data = event.notification.data || {};
  const targetUrl = data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If window already open, focus it
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.postMessage({
            type: 'NOTIFICATION_CLICKED',
            action: clickAction,
            data: data
          });
          return client.focus();
        }
      }
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Background Push Event Handler
self.addEventListener('push', (event) => {
  let payload = {
    title: '🔥 MH ESPORTS Room ID Alert',
    body: 'Custom Room ID & Password published!',
    roomId: '',
    roomPassword: ''
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [300, 100, 300, 100, 400],
    tag: payload.tag || 'mh-room-alert',
    renotify: true,
    requireInteraction: true,
    data: {
      url: '/',
      roomId: payload.roomId,
      roomPassword: payload.roomPassword
    },
    actions: [
      { action: 'open_app', title: 'Open MH ESPORTS' },
      { action: 'copy_creds', title: 'Copy Room ID' }
    ]
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

