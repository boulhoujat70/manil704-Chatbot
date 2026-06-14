const CACHE_NAME = "manil704-chatbot-v1";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./logo.png",
  "./icons/icon-192x192.png",
  "./icons/icon-512x512.png",
  "./icons/maskable-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).catch(() => caches.match("./index.html"));
    })
  );
});
