import {View} from './view.js';
import {Validator} from './validator.js';
import eventBus from '../modules/eventBus.js';
import {CLIENT_REG_SUBMIT, NO_REG_CLIENT} from '../modules/utils/actions.js';

/** Вьюха регистрации клиента */
export class ClientRegView extends View {
    /**
     * Отображение страницы и получение с нее данных
     */
    render() {
        super.renderHtml(
            'Регистрация',
            clientregTemplate(),
            [
                [NO_REG_CLIENT, this._onNoRegistration],
            ]);

        const val = new Validator('feedback', '.form-control', 'send_mess');
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
            };

            eventBus.emit(CLIENT_REG_SUBMIT, data);
        });
    }

    /**
     * Обработка в случае провала
     */
    _onNoRegistration() {
        // ToDo такой email уже существует
        console.log('sorry, this invalid email');
    }
}

