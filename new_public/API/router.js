// import Controller from './controller.js'
//
// async function handleHash() {
//     const hash = (() => {
//         return location.hash ? location.hash.slice(2) : '';
//     })();
//
//     await Controller[hash + 'Route']();
// }
//
// export default {
//     async init() {
//         addEventListener('hashchange', handleHash);
//         await handleHash();
//     }
// }

import Utils from './utils'

class Router {
    constructor() {
        this.controllers = [];
        this.paths = [];
    }
    register(path, controller) {
        this.paths.push(path);
        this.controllers.push(controller)

    }



    start() {

        if (this.paths.length === 0 || this.controllers.length === 0) {
            console.log("WTF");
        }

        this.controller = new Controller();
        this.currentController.index(options);


    }


    go(path) {

        let numberPath = Utils.numberPathFunc(path, this.paths);
        if (numberPath === -1) {
            // TODO(gleensande): обработка ошибки
            console.log('path is not registered' + path);
            return;
        }

        let stateObj = {
            'path': path
        };

        history.pushState(stateObj,'', '/' + path);
        this.route();
    }

    route() {
        let currentState = history.state;

        if (!currentState) {
            // TODO(gleensande): обработка ошибки
        }


    }

    back() {

    }

    forward() {

    }
}
