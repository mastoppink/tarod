// Service worker Show Me: aplikasi tetap bisa dibuka tanpa internet.
// Ubah VERSION setiap kali file aplikasi berubah agar pengguna mendapat versi terbaru.

const VERSION = "show-me-v4";
const IMAGE_CACHE = "show-me-images-v1";

const SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/cards-data.js",
  "./js/topics.js",
  "./js/polarity.js",
  "./js/app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== VERSION && k !== IMAGE_CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;

  // Gambar kartu: cache-first, lalu disimpan saat pertama kali diunduh
  if (url.pathname.includes("/images/")) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const hit = await cache.match(event.request);
        if (hit) return hit;
        const res = await fetch(event.request);
        if (res.ok) cache.put(event.request, res.clone());
        return res;
      })
    );
    return;
  }

  // Halaman dan aset lain: coba jaringan dulu, jika gagal pakai cache
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request).then((hit) => hit || caches.match("./index.html")))
  );
});
