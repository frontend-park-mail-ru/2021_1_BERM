import user from '../models/User.js';

/** Роутер, который осуществляет переход между страницами приложения */
class Router {
    /**
     * Конструктор
     */
    constructor() {
        this.states = new Map([]);
    }

    /**
     * Обработка результата
     *
     * @param {string} path - название страницы
     * @param {Controller} controller - контроллер данной страницы
     */
    register(path, controller) {
        this.states.set(path, controller);
    }

    /**
     * Установка слушателей на событие перехода по различным событиям
     */
    setUp() {
        // Навешиваем обработчик на клики
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', (event) => {
            let href = event.target.getAttribute('href');
            if (href) {
                event.preventDefault();

                if (href === '/profile') {
                    href += `/${user.id}`;
                }
                this.go(href);
            }
        });

        addEventListener('popstate', () => {
            this.start();
        }, false);

        const path = window.location.pathname
            .slice(1);

        this.startPath = '/' + path;
    }

    /**
     * Обработка перехода на данную страницу
     *
     * @param {string} path - название страницы
     */
    go(path) {
        history.pushState(
            {page: path},
            '',
            path,
        );

        this.start();
    }

    /**
     * Осуществление перехода на страницу
     */
    start() {
        let currentState = history.state;

        if (!currentState || !currentState.page) {
            currentState = {
                page: this.startPath,
            };
        }

        let Controller;
        for (const regexp of this.states.keys()) {
            if (regexp.test(currentState.page)) {
                Controller = this.states.get(regexp);
            }
        }

        if (!Controller) {
            console.log(404);
            return;
        }

        const id = currentState.page.split('/')[2];

        if (this.currentController) {
            this.currentController.offAll();
        }

        this.currentController = new Controller();
        this.currentController.run(id);
    }
}

export default new Router();
