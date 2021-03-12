import Controller from './controller.js'

async function handleHash() {
    const hash = (() => {
        return location.hash ? location.hash.slice(2) : '';
    })();

    await Controller[hash + 'Route']();
}

export default {
    async init() {
        addEventListener('hashchange', handleHash);
        await handleHash()
    }
}