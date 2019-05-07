const staticAssets = [
    './index.js',
    './index.html',
    './portfolio.js',
    './manifest.webmanifest',
    './src/*/*.js'
]

self.addEventListener('install', e => {
    console.log('Service worker installed!');
    e.waitUntil(
        caches.open('noteworthy-cache').then(cache => {
            cache.addAll(staticAssets);
        })
    );
});
self.addEventListener('activate', e => {
    console.log('Service worker activated!');
});
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(resp => {
            if(resp) return resp;
            else {
                return fetch(e.request);
            }
        })
    );
});