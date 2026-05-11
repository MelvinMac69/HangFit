const CACHE_NAME = 'hangfit-v7';
const OFFLINE_URL = '/workout';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_URL).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Always network-first for navigation requests (this is the key fix)
  // iOS Safari is very picky about cached redirects
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        // Only cache clean 200 responses — never cache redirects
        if (response.status === 200 && !response.redirected) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(() => {
        // Network failed — try cache, fall back to workout page
        return caches.match(event.request).then((cached) => {
          if (cached && !cached.redirected) {
            return cached;
          }
          return caches.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // For static assets, use stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached && !cached.redirected) {
        const fetchPromise = fetch(event.request).then((response) => {
          if (response.ok && !response.redirected) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return response;
        }).catch(() => {});
        return fetchPromise;
      }
      return fetch(event.request).then((response) => {
        if (response.ok && !response.redirected) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});