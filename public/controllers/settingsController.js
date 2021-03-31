import {Controller} from './controller.js';
import {SettingsView} from '../views/settingsView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";
import user from "../models/User.js";

export class SettingsController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new SettingsView(),
            [
                ['settings-update', this._onUpdate],
                ['settings-submit', this._submit],
                ['send-user-data', this._sendUserData],
            ]);
    }

    _onUpdate(res) {
        if (res.status === 200) {
            res.json()
                .then((res) => {
                    const data = {
                        first_name: res.first_name,
                        second_name: res.second_name,
                        nickName: res.user_name,
                        isExecutor: res.executor,
                        specialize: res.specializes,
                        about: res.about,
                    };

                    user.setAttributes(data);
                    router.go('profile');
                });
            // ToDo eventBus.emit('success-set-up');
        } else {
            eventBus.emit('no-set-up');
        }
    }

    _submit(info) {
        auth.updateSettings(info);
    }

    _sendUserData() {
        eventBus.emit('get-user-data', {
            nickName: user.nickName,
            name: user.first_name,
            surname: user.second_name,
            email: user.email,
        });
    }
}