const staticCacheName = 's-app-v1.2';
const dynamicCacheName = 'd-app-v1.2';

const assetUrls = [
    '/',
    '/bundle.js',
    '/service-worker.js',
    '/index.html',
    '/bundle.css',
    '/0cd1bbbd2362acf8e1c16d358d696df0.svg',
    '/2065182ee5bc74e3bb61a57743d3a8bc.svg',
    '/2405d1975f36adb067e90769c554cd5d.svg',
    '/2b51c626e90217e26e67ab76ae643b4d.svg',
    '/367dfa06a2cc8bbaedcfaf0009ea9d84.svg',
    '/3a391384f2e566494f1272701390a94f.png',
    '/462573ede051768d3a78803f49f1d80c.svg',
    '/4ce25234c5497d77f3b284ad24aff7d6.svg',
    '/503b3cef8be658fd866218abadce8879.svg',
    '/51c18c81b368191c32e8e8810c053a8a.svg',
    '/6a7fcb007481e1402e51eabb92bec123.svg',
    '/6fb044fb65a4f3c35e7c7511ada1c38c.svg',
    '/7e18b4d49d9b1f0afe81d8df2cd60b8c.svg',
    '/93ab78302600784f927f85e521d126ac.svg',
    '/94bdc051bf2d28f97802f84bc1d0f503.svg',
    '/9fc4ab2e98a065209d13305305dbc621.svg',
    '/ac793e1e802fa00d3879f75965d3d501.svg',
    '/b1fa44ffb74f6bb7ddba741a87efee70.svg',
    '/b9e23b129c4bb5aa06a4b816a2dcacf8.svg',
    '/bb69fa1e6ccb9f19aa31b402b71a89fc.svg',
    '/bc7a682299cb8e7f3287ce960bcd2dba.svg',
    '/c1f3b0d002e1b4bb11cea9eb30c61752.svg',
    '/cbc33374381ea3e6ad587245eabb1d98.svg',
    '/d8eeb4069147ef4288ab1e79ad9a012b.svg',
    '/dcc8c890f44b6042f6b9cdbe0edd6ade.svg',
    '/eca91ce3a10addeaf74894cd03937b22.png',
    '/f6056bdcda1b692502ccb8d9a16efdfc.svg',
    '/f8c7f31e8fceab1790172afe7882085a.svg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName)
            .then((cache) => {
                return cache.addAll(assetUrls);
            }));
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
    const {request} = event;

    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);
    // if (!url.toString().includes(':8080')) {
    //     event.respondWith(cacheFirst(request));
    // } else {
        event.respondWith(networkFirst(request));
    // }
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
