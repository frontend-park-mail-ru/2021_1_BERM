import {Controller} from './controller.js';
import {ClientRegView} from '../views/clientRegView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";

export class ClientRegController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new ClientRegView(),
            [
                ['clientReg', this._onRegCl],
                ['clientReg-submit', this._submitRegCl],
            ]);
    }

    _onRegCl(res) {
        if (res.status === 200) {
            router.go('profile')
        } else {
            eventBus.emit('page not found 404');
        }
    }

    _submitRegCl(data) {
        // ToDo(Алексей Егоров): По идее тут выполняется валидация
        console.log(data);
        // Todo api.registration(data);
    }
}