import {Controller} from './controller.js';
import {SettingsView} from '../views/settingsView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";

export class OrderController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new SettingsView(),
            [
                ['order-create', this._onRegCl],
                ['order-submit', this._submitRegCl],
            ]);
    }

    _onRegCl(res) {
        if (res.status === 201) {
            router.go('main-page')
        } else {
            eventBus.emit('no-order');
        }
    }

    _submitRegCl({order_name, specialize, description, budget, deadline}) {
        auth.createOrder({order_name, specialize, description, budget, deadline});
    }
}