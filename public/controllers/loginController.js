import {Controller} from './controller.js';
import {LoginView} from '../views/loginView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from '../models/Auth.js'

export class LoginController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new LoginView(),
            [
            ['login', this._onLogin],
            ['login-submit', this._submitLogin],
        ]);
    }

    _onLogin(res) {
        if (res.status === 200) {
            router.go('main-page', 'FindFreelancer.ru');
        } else {
            eventBus.emit('no-login');
        }
    }

    _submitLogin({email, password}) {
        auth.login({email, password});
    }
}