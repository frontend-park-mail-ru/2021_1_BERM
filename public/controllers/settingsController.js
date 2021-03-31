import {Controller} from './controller.js';
import {SettingsView} from '../views/settingsView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";
import user from "../models/User.js";
import {GET_USER_DATA, NO_SET_UP, SEND_USER_DATA, SETTING_SUBMIT, SETTING_UPD} from "../modules/utils/actions.js";

export class SettingsController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new SettingsView(),
            [
                [SETTING_UPD, this._onUpdate],
                [SETTING_SUBMIT, this._submit],
                [SEND_USER_DATA, this._sendUserData],
            ]);
    }

    _onUpdate(res) {
        if (res.ok) {
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
            eventBus.emit(NO_SET_UP);
        }
    }

    _submit(info) {
        auth.updateSettings(info);
    }

    _sendUserData() {
        eventBus.emit(GET_USER_DATA, {
            nickName: user.nickName,
            name: user.first_name,
            surname: user.second_name,
            email: user.email,
        });
    }
}