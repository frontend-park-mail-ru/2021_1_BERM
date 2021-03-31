import {View} from './view.js';
import eventBus from "../modules/eventBus.js";
import {Validator} from "./validator.js";
import {NO_REG_WORKER, WORKER_REG_SUBMIT} from "../modules/utils/actions.js";

export class WorkerRegView extends View {
    render() {
        super.renderHtml(
            'Регистрация',
            workerregTemplate(),
            [
                [NO_REG_WORKER, this._onNoRegistration],
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

            eventBus.emit(WORKER_REG_SUBMIT, data);
        });
    }

    _onNoRegistration() {
        // ToDo такой email уже существует
        console.log('sorry, this invalid email');
    }
}

