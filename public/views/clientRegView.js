import {View} from './view.js';
import {Validator} from './validator.js';
import eventBus from '../modules/eventBus.js';
import {REGISTRATION_SUBMIT, NO_REG, SERVER_ERROR} from '../modules/utils/actions.js';

import regTemplate from '@/components/pages/registration.pug';
import {notti} from '../components/notification/notti.js';

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
            regTemplate({
                title: 'Регистрация за клиента',
            }),
            [
                [NO_REG, this._onNoRegistration],
                [SERVER_ERROR, this._serverError],
            ]);

        const val = new Validator(
            'registration__form',
            '.form-control',
            'send_mess');
        val.validate();

        const form = document.getElementById('registration__form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                email: event.target.email.value,
                password: event.target.password.value,
                login: event.target.login.value,
                name_surname: event.target.name.value,
            };

            eventBus.emit(REGISTRATION_SUBMIT, data);
        });
    }

    /**
     * Обработка в случае провала
     */
    _onNoRegistration() {
        const form = document.getElementById('err_place');
        form.innerHTML =
            `<div class="error__message">
                    Такая почта уже используется
             </div>`;
    }

    _serverError() {
        notti('Ошибка сервера. Не удалось зарегистрироваться');
    }
}

