import Router from './modules/router.js'

(async () => {
    try {
        Router.init();
    } catch (err) {
        console.error(err);
        // Ошибка
    }
})();