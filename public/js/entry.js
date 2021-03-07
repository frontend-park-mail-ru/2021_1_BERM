import Router from './modules/router.js'

function run() {
    Router.init();
}

run()
    .catch(() => alert('err'));
