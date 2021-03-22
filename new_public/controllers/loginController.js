import {Controller} from './controller';
import {LoginView} from '../views/loginView';

import eventBus from "../eventBus";
import router from "../modules/router";
import api from '../modules/api'

export class LoginController extends Controller {
    run() {
        this.view = new LoginView();
        this.view.render;

        this.listeners = new Array([
                ['login', this._onLogin],
                ['login-submit', this._submitLogin],
            ]);

        super.onAll();
    }

    _onLogin(res) {
        if (res.status === 200) {
            router.go('/index')
        } else {
            eventBus.emit('no-login');
        }
    }

    _submitLogin({email, password}) {
        // ToDo(Алексей Егоров): По идее тут выполняется валидация

        api.login({email, password});
    }
}