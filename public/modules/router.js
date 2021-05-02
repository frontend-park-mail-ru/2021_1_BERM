import user from '../models/User.js';
import utils from './utils/utils.js';
import {getNotFoundPath} from '@/modules/utils/goPath.js';

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
    async setUp() {
        await utils.checkAuthorized();
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
    async start() {
        if (!this.set) {
            this.set = true;
            await this.setUp();
        }
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
            this.go(getNotFoundPath);
            return;
        }

        const id = currentState.page.split('/')[2];

        if (this.currentController) {
            await this.currentController.offAll();
        }

        this.currentController = new Controller();
        this.currentController.run(id);
    }
}

export default new Router();
