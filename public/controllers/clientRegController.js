import {Controller} from './controller.js';
import {ClientRegView} from '../views/clientRegView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import {
    REG,
    CLIENT_REG_SUBMIT,
    NO_REG_CLIENT,
} from '../modules/utils/actions.js';

/** Контроллер регистрации клиента */
export class ClientRegController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
    }

    /**
     * Запуск контроллера регистрации клиента
     */
    run() {
        super.run(
            new ClientRegView(),
            [
                [REG, this._onRegCl],
                [CLIENT_REG_SUBMIT, this._submitRegCl],
            ]);
    }

    /**
     * Обработка результата
     *
     * @param {Response} res - форма
     */
    _onRegCl(res) {
        if (res.ok) {
            router.go('main-page');
        } else {
            eventBus.emit(NO_REG_CLIENT);
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