import {Controller} from './controller.js';
import {ClientRegView} from '../views/clientRegView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import api from '../modules/ajax.js'

export class ClientRegController extends Controller {
    constructor() {
        super();
    }

    run() {
        this.view = new ClientRegView();
        this.view.render();

        this.listeners = new Set([
            ['clientReg', this._onRegCl],
            ['clientReg-submit', this._submitRegCl],
        ]);

        super.onAll();
    }

    _onRegCl(res) {
        if (res.status === 200) {
            router.go('profile')
        } else {
            eventBus.emit('page not found 404');
        }
    }

    _submitRegCl({email, password}) {
        // ToDo(Алексей Егоров): По идее тут выполняется валидация

        api.login({email, password});
    }
}