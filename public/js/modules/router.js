import Controller from './controller.js'

function handleHash() {
    const hash = (() => {
        return location.hash ? location.hash.slice(1) : '';
    })();

    Controller[hash + 'Route']();
}

export default {
    init() {
        addEventListener('hashchange', handleHash);
        handleHash();
    }
}