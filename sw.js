// ASCEND Protocol — Service Worker
// Version du cache — change ce numéro à chaque mise à jour du contenu
const CACHE_NAME = 'ascend-v5';

// Fichiers à mettre en cache pour le mode offline
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// Installation : on met les fichiers en cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation : on supprime les anciens caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch : on sert depuis le cache si possible (offline first)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
