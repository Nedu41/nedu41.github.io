// Portal service worker: uygulama gibi kurulabilsin + internet yokken son
// acilan sayfalar gorunsun. Ag oncelikli ve HTTP onbellegini atlar
// (cache:'no-cache' - GitHub Pages max-age=600 yuzunden yeni surum 10dk
// gecikmesin); ag yoksa son kopya gosterilir.
const ONBELLEK = 'portal-v2';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(k => Promise.all(k.filter(a => a !== ONBELLEK).map(a => caches.delete(a))))
    .then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(r => {
      const kopya = r.clone();
      caches.open(ONBELLEK).then(c => c.put(e.request, kopya));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
