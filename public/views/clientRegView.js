import {View} from './view.js';
import {Validator} from './validator.js';
import eventBus from '../modules/eventBus.js';
import {CLIENT_REG_SUBMIT, NO_REG_CLIENT} from '../modules/utils/actions.js';

import clientRegTemplate from '@/templates/clientReg.pug';

/** View регистрации клиента */
export class ClientRegView extends View {
    /**
     * Отображение страницы и получение с нее данных
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.renderHtml(
            isAuthorized,
            isExecutor,
            'Регистрация',
            clientRegTemplate(),
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
                login: event.target.login.value,
                name_surname: event.target.first_name.value + ' ' +
                    event.target.second_name.value,
                about: 'Заполните информацию о себе',
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

