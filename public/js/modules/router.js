import Controller from './controller.js'

async function handleHash() {
    const hash = (() => {
        return location.hash ? location.hash.slice(2) : '';
    })();

    await Controller[hash + 'Route']();
    await Controller.addHandleLinks();
}

export default {
    init() {
        addEventListener('hashchange', handleHash);
        handleHash()
    }
}