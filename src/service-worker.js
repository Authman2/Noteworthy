// const staticAssets = [
//     './index.js',
//     './index.html',
//     './portfolio.js',
//     './manifest.webmanifest',
//     './src/*/*.js'
// ]

// self.addEventListener('beforeinstallprompt', e => {
//     prompt('Install Noteworthy onto your phone!');
//     e.userChoice.then(result => {
//         if(result.outcome === 'accepted') {
//             console.log('Accepted!');
//         }
//     })
// });
// self.addEventListener('install', e => {
//     console.log('Service worker installed!');
//     e.waitUntil(
//         caches.open('noteworthy-cache').then(cache => {
//             cache.addAll(staticAssets);
//         })
//     );
//     // self.skipWaiting();
// });
// self.addEventListener('activate', e => {
//     console.log('Service worker activated!');
//     self.clients.claim();
// });
// self.addEventListener('fetch', e => {
//     const url = new URL(e.request.url);
//     e.respondWith(caches.match(e.request).then(resp => resp ? resp : fetch(url)));
// });