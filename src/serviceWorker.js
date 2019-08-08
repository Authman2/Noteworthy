const cacheName = 'noteworthy-cache';
const staticAssets = [
    './index.js',
    './index.html',
    './styles/*'
]

self.addEventListener('install', e => {
    console.log('Service worker installed!');
    self.skipWaiting();
    // e.waitUntil(
    //     caches.open(cacheName)
    //         .then(cache => {
    //             console.log('Service worker is caching files...');
    //             cache.addAll(staticAssets);
    //         })
    //         .then(() => self.skipWaiting())
    // );
});
self.addEventListener('activate', e => {
    console.log('Service worker activated!');
});
self.addEventListener('fetch', e => {
    console.log('Service woring fetching!');
    // const url = new URL(e.request.url);
    // e.respondWith(caches.match(e.request).then(resp => resp ? resp : fetch(url)));
});