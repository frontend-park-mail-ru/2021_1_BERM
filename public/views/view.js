import {BaseMVC} from '../modules/baseMVC.js';
import user from '../models/User.js';

import navbarTemplate from '@/templates/navbar.pug';
import profIcon from '@/static/img/icon.png';

/** Базовый класс для отображение страниц */
export class View extends BaseMVC {
    /**
     * Обработка результата
     *
     * @param {string} title - результат запроса
     * @param {HTMLAllCollection} content - результат запроса
     * @param {Array} listenersArr - результат запроса
     */
    renderHtml(title, content, listenersArr = null) {
        let htmlNav;

        if (user.isAuthorized) {
            htmlNav = navbarTemplate({
                authorized: true,
                profIcon: profIcon,
            });
        } else {
            htmlNav = navbarTemplate();
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
        this.listeners = new Set(listenersArr);
        super.onAll();
    }
}
