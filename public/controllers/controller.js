import {BaseMVC} from '../modules/baseMVC.js';
import auth from '../models/Auth.js';
import user from '../models/User.js';

/** Родительский класс, от которого наследуются остальные контроллеры.
 * Осуществляет взаимодействие между моделями и вьюхами  */
export class Controller extends BaseMVC {
    /**
     * Валидации при срабатывании нажатия кнопки
     *
     * @param {any} className - форма
     * @param {Array} listenersArr - массив слушателей
     */
    run(className, listenersArr) {
        if (!user.isAuthorized) {
            this.checkAuthorized();
        }

        this.listeners = new Set(listenersArr);
        super.onAll();

        this.view = className;
        this.view.render();
    }

    /**
     * Проверка авторизованности
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
