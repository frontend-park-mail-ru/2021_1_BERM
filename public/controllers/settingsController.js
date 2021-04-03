import {Controller} from './controller.js';
import {SettingsView} from '../views/settingsView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import user from '../models/User.js';
import {
    GET_USER_DATA,
    NO_SET_UP,
    SEND_USER_DATA,
    SETTING_SUBMIT,
    SETTING_UPD,
} from '../modules/utils/actions.js';

/** Контроллер создания заказа */
export class SettingsController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
    }

    /**
     * Запуск контроллера настроек
     */
    run() {
        super.run(
            new SettingsView(),
            [
                [SETTING_UPD, this._onUpdate],
                [SETTING_SUBMIT, this._submit],
                [SEND_USER_DATA, this._sendUserData],
            ]);
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
                        specializes: res.specializes,
                        about: res.about,
                        email: res.email,
                    };

                    user.setAttributes(data);
                    router.go('profile');
                });
            // ToDo eventBus.emit('success-set-up');
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
            login: user.login,
            name: user.nameSurname,
            email: user.email,
        });
    }
}
