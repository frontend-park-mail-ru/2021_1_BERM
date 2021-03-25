import {BaseMVC} from "../modules/baseMVC.js";

export class Controller extends BaseMVC {
    run(className, listenersArr) {
        this.view = className
        this.view.render();

        this.listeners = new Set(listenersArr);

        super.onAll();
    }
}