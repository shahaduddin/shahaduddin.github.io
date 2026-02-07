const CACHE_NAME = 'pynum-studio-v3-offline';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap'
];

// Install event - caching the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - cleaning up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serving from cache or network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Strategy for Navigation requests (Single Page App routing)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((response) => {
        return response || fetch(event.request).catch(() => {
           // Fallback to cache if network fails (Offline mode)
           return caches.match('./index.html');
        });
      })
    );
    return;
  }

  // Strategy for Assets (Cache First, fallback to Network and Cache)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        // Check for valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
          return networkResponse;
        }

        // IMPORTANT: We clone the response to cache it.
        // We allow caching of CORS requests (type: 'cors') which covers esm.sh modules.
        const responseToCache = networkResponse.clone();

        caches.open(CACHE_NAME).then((cache) => {
          // Avoid caching large binary files or API responses if necessary, 
          // but for this app, we cache everything to ensure offline code execution.
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch((err) => {
        // Network failure
        console.log('[Service Worker] Network request failed', err);
        // Optional: Return a placeholder image if it was an image request
      });
    })
  );
});