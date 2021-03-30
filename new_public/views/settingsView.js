import {View} from './view.js';
import {Validator} from './validator.js'
import eventBus from "../modules/eventBus.js";

export class SettingsView extends View {
    render() {
        super.setListeners([
            ['get-user-data', this._renderData],
            ['no-set-up', this._onNoSetUp],
        ]);
        eventBus.emit('send-user-data');
    }

    _renderData(data) {
        super.renderHtml(
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

            eventBus.emit('settings-submit', data);
        });
    }

    _onNoSetUp() {
        // ToDo настройки не удалось сохранить
        console.log('настройки не удалось сохранить');
    }
}

