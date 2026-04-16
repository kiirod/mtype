const CACHE_NAME = 'mtype-redirects-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Only cache profile redirect pages (e.g. /miodec)
  // Ignore root, static assets, and API calls
  const isRedirectPage = url.pathname.length > 1
    && !url.pathname.includes('.')
    && !url.pathname.startsWith('/api');

  if (!isRedirectPage) return;

  e.respondWith(
    caches.open(CACHE_NAME).then(cache =>
      cache.match(e.request).then(cached => {
        if (cached) {
          fetch(e.request).then(fresh => {
            if (fresh && fresh.ok) cache.put(e.request, fresh.clone());
          }).catch(() => {});
          return cached;
        }

        return fetch(e.request).then(response => {
          if (response && response.ok) {
            cache.put(e.request, response.clone());
          }
          return response;
        });
      })
    )
  );
});
