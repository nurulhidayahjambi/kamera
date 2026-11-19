// Kamera Presensi NHJ — menyimpan halaman kamera di HP supaya terbuka seketika. Tidak menyimpan foto atau data apa pun.
const NAMA = 'kamera-nhj-v3';
self.addEventListener('install', e => { e.waitUntil(caches.open(NAMA).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== NAMA).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
// Dari simpanan lebih dulu (seketika); sekaligus memperbarui simpanan di belakang untuk pembukaan berikutnya.
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(NAMA).then(c => c.match(e.request, { ignoreSearch: true }).then(lama => {
    const baru = fetch(e.request).then(r => { if (r && r.ok) c.put(e.request, r.clone()); return r; }).catch(() => lama);
    return lama || baru;
  })));
});
