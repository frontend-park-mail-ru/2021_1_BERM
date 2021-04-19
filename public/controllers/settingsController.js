import {Controller} from './controller.js';
import {SettingsView} from '../views/settingsView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import user from '../models/User.js';
import {
    GET_USER_DATA,
    NO_SET_UP,
    SETTING_SEND_DATA,
    SETTING_SUBMIT,
    SETTING_GET,
} from '../modules/utils/actions.js';

/** Контроллер создания заказа */
export class SettingsController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new SettingsView();
    }

    /**
     * Запуск контроллера настроек
     */
    run(id) {
        super.run(
            [
                [SETTING_GET, this._onUpdate],
                [SETTING_SUBMIT, this._submit],
                [SETTING_SEND_DATA, this._sendUserData],
            ],
            true);
    }

    /**
     * Обработка результата
     *
     * @param {Response} res - результат запроса
     */
    _onUpdate(res) {
        if (res.ok) {
            res.json()
                .then((res) => {
                    const data = {
                        nameSurname: res.name_surname,
                        login: res.login,
                        isExecutor: res.executor,
                        about: res.about,
                        email: res.email,
                    };

                    user.setAttributes(data);
                    router.go(`/profile/${user.id}`);
                });
        } else {
            eventBus.emit(NO_SET_UP);
        }
    }

    /**
     * Отправка результата
     *
     * @param {Object} info - данные на отправку
     */
    _submit(info) {
        auth.updateSettings(info);
    }

    /**
     * Отправка данных для render в SettingsView
     */
    _sendUserData() {
        eventBus.emit(GET_USER_DATA, {
            isAuthorized: user.isAuthorized,
            isExecutor: user.isExecutor,
            login: user.login,
            name: user.nameSurname,
            email: user.email,
        });
    }
}
