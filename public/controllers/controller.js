import {BaseMVC} from '../modules/baseMVC.js';
import auth from '../models/Auth.js';
import user from '../models/User.js';

/** Родительский класс, от которого наследуются остальные контроллеры.
 * Осуществляет взаимодействие между моделями и view  */
export class Controller extends BaseMVC {
    /**
     * Валидации при срабатывании нажатия кнопки
     *
     * @param {any} view - форма
     * @param {Array} listenersArr - массив слушателей
     */
    run(view, listenersArr) {
        if (!user.isAuthorized) {
            this.checkAuthorized();
        }

        this.listeners = new Set(listenersArr);
        super.onAll();

        this.view = view;
        view.render();
    }

    /**
     * Проверка авторизации
     */
    checkAuthorized() {
        auth.isAuthorized()
            .then((res) => {
                if (res.ok) {
                    res.json()
                        .then((result) => {
                            user.isAuthorized = true;
                            user.id = result.id;
                        });
                }
            });
        user.isAuthorized = true;
        user.id = 12;
    }
}
