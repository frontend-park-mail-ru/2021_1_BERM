import {Controller} from './controller.js';
import {LoginView} from '../views/loginView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import {LOGIN, LOGIN_SUBMIT, NO_LOGIN} from '../modules/utils/actions.js';
import {MAIN_PAGE} from '../modules/utils/pageNames.js';

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
     * Запуск контроллера входа
     */
    run() {
        super.run(
            [
                [LOGIN, this._onLogin],
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
            router.go(MAIN_PAGE);
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
