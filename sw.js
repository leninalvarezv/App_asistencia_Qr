// Guarda la app en el celular para que abra aunque no haya señal en la obra.
const CACHE = 'asistencia-gp-v2';
const ARCHIVOS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './logo-greenpark.png',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Las llamadas a la API (script.google.com) siempre van a la red
  if (e.request.method !== 'GET' || url.hostname.includes('google')) return;
  e.respondWith(
    fetch(e.request, { cache: 'no-cache' }).then(r => {
      const copia = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copia));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
