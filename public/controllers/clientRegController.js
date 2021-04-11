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
import {MAIN_PAGE} from '../modules/utils/pageNames.js';

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
    run() {
        super.run(
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
            router.go(MAIN_PAGE);
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
