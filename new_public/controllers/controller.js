import {BaseMVC} from "../modules/baseMVC.js";
import auth from "../models/Auth.js"
import user from "../models/User.js";

export class Controller extends BaseMVC {
    run(className, listenersArr) {
        if (!user.isAuthorized) {
            this.checkAuthorized();
        }

        this.listeners = new Set(listenersArr);
        super.onAll();

        this.view = className;
        this.view.render();
    }

    checkAuthorized() {
        auth.isAuthorized()
            .then((res) => {
                if (res.status === 200) {
                    res.json()
                        .then((result) => {
                            user.isAuthorized = true;
                            user.id = result.id;
                        });
                }
            });
        user.isAuthorized = true;
        user.id = 1;
    }
}