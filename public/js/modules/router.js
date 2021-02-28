import Controller from './controller.js'

function getRouteHash() {
    return location.hash ? location.hash.slice(1) : '';
}

function handleHash() {
    const hash = getRouteHash();

    Controller[hash + 'Route']();
}

export default {
    init() {
        addEventListener('hashchange', handleHash);
        handleHash();
    }
}