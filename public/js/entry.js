import Router from './modules/router.js'

async function run() {
    Router.init();
}

run()
    .catch(() => alert('err'));