const staticCacheName = 's-app-v1';
const dynamicCacheName = 'd-app-v1';

const timeout = 400;

// const {assets} = global.serviceWorkerOption;
//
// let assetsToCache = [...assets, './'];
//
// assetsToCache = assetsToCache.map((path) => {
//     return new URL(path, global.location).toString();
// });
//
// self.addEventListener('install', (event) => {
//     event.waitUntil(
//         caches.open(staticCacheName)
//             .then((cache) => cache.addAll(assetsToCache)));
// });

self.addEventListener('activate', async (event) => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter((name) => name !== staticCacheName)
            .filter((name) => name !== dynamicCacheName)
            .map((name) => caches.delete(name)));
});

self.addEventListener('fetch', (event) => {
    event.respondWith(fromNetwork(event.request, timeout)
        .catch((err) => {
            console.log(`Error: ${err.message()}`);
            return fromCache(event.request);
        }));
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
