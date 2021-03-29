import {View} from './view.js';
import {Validator} from './validator.js'
import eventBus from "../modules/eventBus.js";

export class SettingsView extends View {
    render() {
        super.renderHtml(
            settingsTemplate(),
            [
                ['no-set-up', this._onNoRegistration],
            ]);

        let val = new Validator('feedback', '.form-control', 'send_mess');
        val.validate();

        const form = document.getElementById('feedback');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                password: event.target.password.value,
                user_name: event.target.user_name.value,
                first_name: event.target.first_name.value,
                second_name: event.target.second_name.value,
                specialize: event.target.specialize,
                about: event.target.about,
            };

            eventBus.emit('settings-submit', data);
        });
    }

    _onNoRegistration() {
        // ToDo такой email уже существует
        console.log('bizarro');
    }
}

