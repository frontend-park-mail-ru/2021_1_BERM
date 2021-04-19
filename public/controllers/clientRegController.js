import {Controller} from './controller.js';
import {ClientRegView} from '../views/clientRegView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';

import {
    REGISTRATION_GET,
    REGISTRATION_SUBMIT,
    NO_REG,
    SERVER_ERROR,
} from '../modules/utils/actions.js';
import user from '../models/User.js';

/** Контроллер регистрации клиента */
export class ClientRegController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new ClientRegView();
    }

    /**
     * Запуск контроллера регистрации клиента
     */
    run(id) {
        super.run(
            [
                [REGISTRATION_GET, this._onRegCl],
                [REGISTRATION_SUBMIT, this._submitRegCl],
            ]);
    }

    /**
     * Обработка результата
     *
     * @param {Response} res - форма
     */
    _onRegCl(res) {
        if (res.ok) {
            res.json()
                .then((res) => {
                    user.isAuthorized = true;
                    user.id = res.id;
                    user.isExecutor = res.executor;

                    router.go(`/profile/${user.id}`);
                });
        } else {
            if (res.status === 400) {
                eventBus.emit(NO_REG);
                return;
            }
            eventBus.emit(SERVER_ERROR);
        }
    }

    /**
     * Отправка результата
     *
     * @param {Object} info - результат запроса
     */
    _submitRegCl(info) {
        auth.reg(info);
    }
}
