import {Controller} from './controller.js';
import {ClientRegView} from '../views/clientRegView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from '../models/Auth.js'
import {REG, CLIENT_REG_SUBMIT, NO_REG_CLIENT} from "../modules/utils/actions.js";

export class ClientRegController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new ClientRegView(),
            [
                [REG, this._onRegCl],
                [CLIENT_REG_SUBMIT, this._submitRegCl],
            ]);
    }

    _onRegCl(res) {
        if (res.ok) {
            router.go('main-page');
        } else {
            eventBus.emit(NO_REG_CLIENT);
        }
    }

    _submitRegCl(info) {
        auth.reg(info);
    }
}