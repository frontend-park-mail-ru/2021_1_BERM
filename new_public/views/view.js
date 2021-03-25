import {BaseMVC} from "../modules/baseMVC.js";

export class View extends BaseMVC {
    renderHtml(html) {
        // Здесь вся отрисовка
        const root = document.getElementById('root');
        root.innerHTML = html;
    }
}
