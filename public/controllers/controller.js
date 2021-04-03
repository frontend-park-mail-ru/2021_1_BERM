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
    async run(view, listenersArr) {
        if (!user.isAuthorized) {
            await this.checkAuthorized();
        }

        this.listeners = new Set(listenersArr);
        super.onAll();

        this.view = view;
        view.render(user.isAuthorized);
    }

    /**
     * Проверка авторизации
     */
    async checkAuthorized() {
        return auth.isAuthorized()
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((result) => {
                if (result) {
                    user.isAuthorized = true;
                    user.id = result.id;
                }
            })
            .catch((result) => {
                console.log('Error. CheckAuthorized.', result);
            });
    }
}
