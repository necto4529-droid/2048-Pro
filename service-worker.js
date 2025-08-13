const CACHE_NAME = '2048-pro-cache-v1';
const urlsToCache = [
  '/',
  '/2048-Pro/',
  '/2048-Pro/index.html',
  '/2048-Pro/style.css',
  '/2048-Pro/script.js',
  '/2048-Pro/icon.png'
];

// Устанавливаем service worker и кэшируем нужные файлы
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Работаем офлайн из кэша
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Обновляем кэш при изменениях
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});
