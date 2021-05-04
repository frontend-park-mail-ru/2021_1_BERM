import {Controller} from './controller.js';
import {LoginView} from '@/views/loginView';

import eventBus from '@/modules/eventBus.js';
import router from '@/modules/router.js';
import auth from '@/models/Auth.js';
import {LOGIN_GET, LOGIN_SUBMIT, NO_LOGIN} from '@/modules/constants/actions';
import user from '@/models/User.js';
import {getProfilePath} from '@/modules/constants/goPath.js';

/** Контроллер регистрации клиента */
export class LoginController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new LoginView();
    }

    /**
     * Запуск контроллера регистрации клиента
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        super.run(
            [
                [LOGIN_GET, this._onLogin],
                [LOGIN_SUBMIT, this._submitLogin],
            ]);
    }

    /**
     * Обработка результата
     *
     * @param {Response} res - результат запроса
     */
    _onLogin(res) {
        if (res.ok) {
            res.json()
                .then((res) => {
                    user.isAuthorized = true;
                    user.id = res.id;
                    user.isExecutor = res.executor;

                    router.go(getProfilePath(user.id));
                });
        } else {
            eventBus.emit(NO_LOGIN);
        }
    }

    /**
     * Отправка результата
     *
     * @param {Object} info - форма
     */
    _submitLogin(info) {
        auth.login(info);
    }
}
