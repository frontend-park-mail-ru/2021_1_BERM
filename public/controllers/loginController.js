import {Controller} from './controller.js';
import {LoginView} from '../views/loginView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from '../models/Auth.js'
import {LOGIN, LOGIN_SUBMIT, NO_LOGIN} from "../modules/utils/actions.js";

export class LoginController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new LoginView(),
            [
            [LOGIN, this._onLogin],
            [LOGIN_SUBMIT, this._submitLogin],
        ]);
    }

    _onLogin(res) {
        if (res.ok) {
            router.go('main-page');
        } else {
            eventBus.emit(NO_LOGIN);
        }
    }

    _submitLogin({email, password}) {
        auth.login({email, password});
    }
}