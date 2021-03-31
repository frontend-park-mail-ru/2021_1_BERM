import {BaseMVC} from '../modules/baseMVC.js';
import user from '../models/User.js';

/** Базовый класс для отображение страниц */
export class View extends BaseMVC {
    /**
     * Обработка результата
     *
     * @param {string} title - результат запроса
     * @param {HTMLAllCollection} content - результат запроса
     * @param {Set} listenersArr - результат запроса
     */
    renderHtml(title, content, listenersArr = null) {
        let htmlNav;

        if (user.isAuthorized) {
            htmlNav = navbarTemplate({
                authorized: true,
                profIcon: 'static/img/icon.png',
            });
        } else {
            htmlNav = navbarTemplate();
        }

        // Здесь вся отрисовка

        document.title = title;

        const root = document.getElementById('root');
        root.innerHTML = htmlNav + content;

        if (listenersArr) {
            this.setListeners(listenersArr);
        }
    }

    setListeners(listenersArr) {
        this.listeners = new Set(listenersArr);
        super.onAll();
    }
}
