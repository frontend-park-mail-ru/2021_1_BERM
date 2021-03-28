import {View} from './view.js';
import eventBus from "../modules/eventBus.js";
import {Validator} from "./validator.js";

export class WorkerRegView extends View {
    render() {
        super.renderHtml(
            workerregTemplate(),
            [
                ['no-registration-work', this._onNoRegistration],
            ]);

        let val = new Validator('feedback', '.form-control', 'send_mess');
        val.validate();

        const form = document.getElementById('feedback');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                email: event.target.email.value,
                password: event.target.password.value,
                user_name: event.target.user_name.value,
                first_name: event.target.first_name.value,
                second_name: event.target.second_name.value,
                specializes: [event.target.specializes.value,],
                about: "Заполните информацию о себе",
            };

            eventBus.emit('work_registered-submit', data);
        });
    }

    _onNoRegistration() {
        // ToDo такой email уже существует
        console.log('sorry, this invalid email');
    }
}

