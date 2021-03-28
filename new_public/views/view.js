import {BaseMVC} from "../modules/baseMVC.js";
import user from "../models/User.js";

export class View extends BaseMVC {
    renderHtml(content, listenersArr = null) {
        let htmlNav = navbarTemplate();

        if (user.isAuthorized) {
            htmlNav = navbarTemplate({
                authorized: true,
                profIcon: "static/img/icon.png",
            });
        }

        // Здесь вся отрисовка
        const root = document.getElementById('root');
        root.innerHTML = htmlNav + content;

        if (listenersArr) {
            this.setListeners(listenersArr);
            super.onAll();
        }
    }

    setListeners(listenersArr) {
        this.listeners = new Set(listenersArr);
        super.onAll();
    }
}
