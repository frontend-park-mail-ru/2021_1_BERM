import {Controller} from './controller.js';
import {WorkerRegView} from '@/views/workerRegView';

import eventBus from '@/modules/eventBus.js';
import router from '@/modules/router.js';
import auth from '@/models/Auth.js';
import user from '@/models/User.js';

import {
    REGISTRATION_SUBMIT,
    REGISTRATION_GET, NO_REG, SERVER_ERROR,
} from '@/modules/constants/actions.js';
import {getProfilePath} from '@/modules/constants/goPath.js';

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
     *
     * @param {number} id - id из url, если он там был
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
     * @param {Response} res - результат запроса
     */
    _onRegCl(res) {
        if (res.ok) {
            res.json()
                .then((res) => {
                    user.isAuthorized = true;
                    user.id = res.id;
                    user.isExecutor = res.executor;

                    router.go(getProfilePath(user.id));
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
     * @param {Object} info - данные на отправку
     */
    _submitRegCl(info) {
        info.specializes = [user.spec];
        auth.reg(info);
    }
}
