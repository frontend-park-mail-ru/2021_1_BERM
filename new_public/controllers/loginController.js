import {Controller} from './controller.js';
import {LoginView} from '../views/loginView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import api from '../modules/api.js'

export class LoginController extends Controller {
    constructor() {
        super();
    }

    run() {
        this.view = new LoginView();
        this.view.render();

        this.listeners = new Set([
                ['login', this._onLogin],
                ['login-submit', this._submitLogin],
            ]);

        super.onAll();
    }

    _onLogin(res) {
        if (res.status === 200) {
            router.go('index')
        } else {
            eventBus.emit('no-login');
        }
    }

    _submitLogin({email, password}) {
        // ToDo(Алексей Егоров): По идее тут выполняется валидация

        api.login({email, password});
    }
}