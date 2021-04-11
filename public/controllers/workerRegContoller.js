import {Controller} from './controller.js';
import {WorkerRegView} from '../views/workerRegView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import {
    NO_REG_WORKER,
    REG,
    WORKER_REG_SUBMIT,
} from '../modules/utils/actions.js';

/** Контроллер создания заказа */
export class WorkerRegController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new WorkerRegView();
    }

    /**
     * Запуск контроллера регистрации исполнителя
     */
    run(id) {
        super.run(
            [
                [REG, this._onRegCl],
                [WORKER_REG_SUBMIT, this._submitRegCl],
            ]);
    }

    /**
     * Обработка результата
     *
     * @param {Response} res - результат запроса
     */
    _onRegCl(res) {
        if (res.ok) {
            router.go('/');
        } else {
            eventBus.emit(NO_REG_WORKER);
        }
    }

    /**
     * Отправка результата
     *
     * @param {Object} info - данные на отправку
     */
    _submitRegCl(info) {
        auth.reg(info);
    }
}
