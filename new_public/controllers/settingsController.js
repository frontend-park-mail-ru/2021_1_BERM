import {Controller} from './controller.js';
import {SettingsView} from '../views/settingsView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";

export class SettingsController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new SettingsView(),
            [
                ['settings_update', this._onRegCl],
                ['settings-submit', this._submitRegCl],
            ]);
    }

    _onRegCl(res) {
        if (res.status === 200) {
            router.go('profile')
        } else {
            eventBus.emit('no-set-up');
        }
    }

    _submitRegCl({password, user_name, first_name, second_name, specializes, about}) {
        auth.updateSettings({password, user_name, first_name, second_name, specializes, about});
    }
}