import Controller from './controller.js'

function handleHash() {
    const hash = (() => {
        return location.hash ? location.hash.slice(2) : '';
    })();

    Controller[hash + 'Route']();
    Controller.addHandleLinks();
}

export default {
    init() {
        addEventListener('hashchange', handleHash);
        handleHash();
    }
}