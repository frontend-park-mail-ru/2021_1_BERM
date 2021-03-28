import {Controller} from './controller.js';
import {ClientRegView} from '../views/clientRegView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from '../models/Auth.js'

export class ClientRegController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new ClientRegView(),
            [
                ['registered', this._onRegCl],
                ['registered-submit', this._submitRegCl],
            ]);
    }

    _onRegCl(res) {
        if (res.status === 200 || res.status === 201) {
            router.go('main-page')
        } else {
            eventBus.emit('no-registration');
        }
    }

    _submitRegCl({email, password, user_name, first_name, second_name, specializes}) {
        auth.reg({email, password, user_name, first_name, second_name, specializes});
    }

}