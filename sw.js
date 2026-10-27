// Portal service worker: uygulama gibi kurulabilsin + internet yokken son
// acilan sayfalar gorunsun. Ag oncelikli - her zaman taze sayfa denenir.
const ONBELLEK = 'portal-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      const kopya = r.clone();
      caches.open(ONBELLEK).then(c => c.put(e.request, kopya));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
