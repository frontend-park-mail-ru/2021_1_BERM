import {BaseMVC} from '@/modules/baseMVC.js';

import navbarUnauthTemplate from '@/components/navbars/navbarUnauth.pug';
import navbarCustomerTemplate from '@/components/navbars/navbarCustomer.pug';
import navbarExecutorTemplate from '@/components/navbars/navbarExecutor.pug';


/** Базовый класс для отображение страниц */
export class View extends BaseMVC {
    /**
     * Обработка результата
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     * @param {string} title - результат запроса
     * @param {HTMLAllCollection} content - результат запроса
     * @param {Array} listenersArr - результат запроса
     */
    renderHtml(isAuthorized, isExecutor, title, content, listenersArr = null) {
        let htmlNav;

        if (isAuthorized) {
            if (isExecutor) {
                htmlNav = navbarExecutorTemplate();
            } else {
                htmlNav = navbarCustomerTemplate();
            }
        } else {
            htmlNav = navbarUnauthTemplate();
        }

        document.title = title;

        const root = document.getElementById('root');
        root.innerHTML = htmlNav + content;

        if (listenersArr) {
            this.setListeners(listenersArr);
        }
    }

    /**
     * Добавляет слушателей на события
     *
     * @param {Array} listenersArr - массив событий
     */
    setListeners(listenersArr) {
        this.listeners = listenersArr;
        super.onAll();
    }
}
