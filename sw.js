const CACHE_NAME = 'mangaluru-fresh-shell-v1';
const APP_SHELL = ['./', './index.html', './manifest.webmanifest', './icons/mf-192.png', './icons/mf-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL.filter(Boolean))).then(() => self.skipWaiting()).catch(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Do not cache Firebase/API or third-party requests.
  event.respondWith(fetch(req).then(response => {
    if (response && response.ok) { const copy=response.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(req,copy)); }
    return response;
  }).catch(() => caches.match(req).then(cached => cached || caches.match('./index.html') || caches.match('./'))));
});
