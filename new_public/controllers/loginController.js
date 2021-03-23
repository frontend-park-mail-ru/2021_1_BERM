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
        this.view = new LoginView();
        this.view.render();

        this.listeners = new Set([
                ['login', this._onLogin],
                ['login-submit', this._submitLogin],
                ['go-client-reg', this._goClientReg],
                ['go-worker-reg', this._goWorkerReg],
                ['go-main-page', this._goStartPage],
                ['go-login', this._goLogin],
            ]);

        super.onAll();
    }

    _onLogin(res) {
        if (res.status === 200) {
            router.go('main-page', 'FindFreelancer.ru')
        } else {
            eventBus.emit('no-login');
        }
    }

    _submitLogin({email, password}) {
        // ToDo(Алексей Егоров): По идее тут выполняется валидация

        auth.login({email, password});
    }

    _goClientReg() {
        router.go('client-reg', 'Регистрация');
    }

    _goWorkerReg() {
        router.go('worker-reg', 'Регистрация');
    }

    _goStartPage() {
        router.go('main-page', 'FindFreelancer.ru');
    }

    _goLogin() {
        router.go('login', 'Авторизация');
    }
}