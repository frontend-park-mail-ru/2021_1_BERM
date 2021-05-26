const staticCacheName = 's-app-v4.1';
const dynamicCacheName = 'd-app-v4.1';

const assetUrls = [
    '/',
    '/bundle.js',
    '/sw.js',
    '/index.html',
    '/main.css',

    '0cd1bbbd2362acf8e1c16d358d696df0.svg',
    '503b3cef8be658fd866218abadce8879.svg',
    '9fc4ab2e98a065209d13305305dbc621.svg',
    'd8eeb4069147ef4288ab1e79ad9a012b.svg',
    '2065182ee5bc74e3bb61a57743d3a8bc.svg',
    '51c18c81b368191c32e8e8810c053a8a.svg',
    'ac793e1e802fa00d3879f75965d3d501.svg',
    'dcc8c890f44b6042f6b9cdbe0edd6ade.svg',
    '2405d1975f36adb067e90769c554cd5d.svg',
    '6931d60bfeb69e0fc2fc3e31f3da8c21.svg',
    'b1fa44ffb74f6bb7ddba741a87efee70.svg',
    'f6056bdcda1b692502ccb8d9a16efdfc.svg',
    '2b51c626e90217e26e67ab76ae643b4d.svg',
    '6a7fcb007481e1402e51eabb92bec123.svg',
    'b9e23b129c4bb5aa06a4b816a2dcacf8.svg',
    'f8c7f31e8fceab1790172afe7882085a.svg',
    '2ca636672a915bd500ba4e4d79a762c8.svg',
    '6fb044fb65a4f3c35e7c7511ada1c38c.svg',
    'bb69fa1e6ccb9f19aa31b402b71a89fc.svg',
    'fea0d5a0c443bb06a9f3cb266a28e258.svg',
    '367dfa06a2cc8bbaedcfaf0009ea9d84.svg',
    '7e18b4d49d9b1f0afe81d8df2cd60b8c.svg',
    'bc7a682299cb8e7f3287ce960bcd2dba.svg',
    'ff52da9dc055086c47111c955c74912c.svg',
    '462573ede051768d3a78803f49f1d80c.svg',
    '93ab78302600784f927f85e521d126ac.svg',
    'c1f3b0d002e1b4bb11cea9eb30c61752.svg',
    '4ce25234c5497d77f3b284ad24aff7d6.svg',
    '94bdc051bf2d28f97802f84bc1d0f503.svg',
    'cbc33374381ea3e6ad587245eabb1d98.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => {
                return cache.addAll(assetUrls);
            }));
});

self.addEventListener('install', (event) => {
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', async (event) => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter((name) => name !== staticCacheName)
            .filter((name) => name !== dynamicCacheName)
            .map((name) => caches.delete(name)),
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.cache === 'only-if-cached' &&
        event.request.mode !== 'same-origin') {
        return;
    }

    const {request} = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);
    if (!url.toString().includes('/api')) {
        event.respondWith(cacheFirst(request));
    } else {
        event.respondWith(networkFirst(request));
    }
});

/**
 * Смотрим в кеш и если он есть возвращаем его, иначе делаем запрос
 *
 * @param {Request} request
 */
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    const response = await fetch(request);
    const cache = await caches.open(staticCacheName);
    await cache.put(request.url, response.clone());

    return response;
}

/**
 * Делаем запрос и если он успешный возвращаем, иначе смотрим в кеш
 *
 * @param {Request} request
 */
async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName);
    try {
        const response = await fetch(request);
        await cache.put(request.url, response.clone());
        return response;
    } catch (e) {
        const cached = await cache.match(request.url);
        return cached ?? null; // ToDo Сделать страницу offline
    }
}
