import {BaseMVC} from "../modules/baseMVC.js";

export class View extends BaseMVC {
    renderHtml(html, listenersArr) {
        // Здесь вся отрисовка
        const root = document.getElementById('root');
        root.innerHTML = html;

        this.listeners = new Set(listenersArr);

        super.onAll()
    }
}
