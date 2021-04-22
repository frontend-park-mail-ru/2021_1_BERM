const staticCacheName = 's-app-v1';
const dynamicCacheName = 'd-app-v1';

const timeout = 400;

const assetUrls = [
    '/',
    '/bundle.js',
    '/index.html',
    '/main.css',
];

self.addEventListener('install', (event) => {
    console.log('Service worker install event!');
    event.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => {
                return cache.addAll(assetUrls);
            }));
});

self.addEventListener('activate', (event) => {
    console.log('Service worker activate event!');
});
// self.addEventListener('activate', async (event) => {
//     const cacheNames = await caches.keys();
//     await Promise.all(
//         cacheNames
//             .filter((name) => name !== staticCacheName)
//             .filter((name) => name !== dynamicCacheName)
//             .map((name) => caches.delete(name)));
//     debugger;
// });

self.addEventListener('fetch', (event) => {
    event.respondWith(fromNetwork(event.request, timeout)
        .catch((err) => {
            console.log(`Error: ${err.message()}`);
            return fromCache(event.request);
        }));
    debugger;
});

fromNetwork = (request, timeout) => {
    return new Promise((fulfill, reject) => {
        const timeoutId = setTimeout(reject, timeout);
        fetch(request).then((response) => {
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject);
    });
};

fromCache = (request) => {
    return caches.open(dynamicCacheName).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject(new Error('no-match'))));
};
