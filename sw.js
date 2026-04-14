const CACHE_NAME = 'pwa-auth-v1';

// Daftar semua file yang ingin disimpan agar bisa diakses offline
const ASSETS = [
    '/',
    '/index.html',
    '/dashboard.html',
    '/app.js',
    '/manifest.json',
    // Jika nanti kamu punya CSS atau Gambar, tambahkan di sini:
    // '/style.css',
    // '/icon.png'
];

// Tahap Install: Menyimpan file ke dalam cache browser
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(ASSETS);
        })
    );
});

// Tahap Activate: Membersihkan cache lama jika ada update
self.addEventListener('activate', (e) => {
    e.waitUntil(
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
});

// Tahap Fetch: Mengambil data dari cache jika sedang offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // Jika ada di cache, pakai cache. Jika tidak, ambil dari jaringan.
            return cachedResponse || fetch(e.request);
        })
    );
});
