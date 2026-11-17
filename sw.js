const CACHE_NAME = 'as-collab-v1.0';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/services.html',
  '/calculator.html',
  '/audit.html',
  '/portal.html',
  '/css/custom.css',
  '/js/app.js',
  '/manifest.json',
  '/assets/images/agency_logo.jpg',
  '/assets/images/founder_akshit.jpg',
  '/assets/images/google_business_badge.png',
  '/assets/images/google_business_qr.png',
  '/assets/images/amazon-ranking.jpg',
  '/assets/images/ugc-production.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Cache add error ignored during install:', err);
      });
    })
  );
  self.skipWaiting();
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
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});