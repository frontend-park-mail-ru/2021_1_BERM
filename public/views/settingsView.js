import {View} from './view.js';
import {Validator} from './validator.js'
import eventBus from "../modules/eventBus.js";
import {GET_USER_DATA, NO_SET_UP, SEND_USER_DATA, SETTING_SUBMIT} from "../modules/utils/actions.js";

export class SettingsView extends View {
    render() {
        super.setListeners([
            [GET_USER_DATA, this._renderData],
            [NO_SET_UP, this._onNoSetUp],
        ]);
        eventBus.emit(SEND_USER_DATA);
    }

    _renderData(data) {
        super.renderHtml(
            'Настройки',
            settingsTemplate(data)
        );

        let val = new Validator('feedback', '.form-control', 'send_mess');
        val.validate();

        const form = document.getElementById('feedback');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                name_surname: event.target.first_name.value + " " + event.target.second_name.value,
                password: event.target.password.value,
                user_name: event.target.user_name.value,
                specialize: '', // TODO event.target.specialize.value,
                about: event.target.about.value,
            };

            eventBus.emit(SETTING_SUBMIT, data);
        });
    }

    _onNoSetUp() {
        // ToDo настройки не удалось сохранить
        console.log('настройки не удалось сохранить');
    }
}

