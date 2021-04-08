import {View} from './view.js';

import eventBus from '../modules/eventBus.js';
import {
    LOGIN_SUBMIT,
    NO_LOGIN,
} from '../modules/utils/actions.js';

import loginTemplate from '@/templates/login.pug';

/** View логина */
export class LoginView extends View {
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
            'Авторизация',
            loginTemplate(),
            [
                [NO_LOGIN, this._onNoLogin],
            ]);

        const form = document.getElementById('login__window');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                email: event.target.email.value,
                password: event.target.password.value,
            };

            eventBus.emit(LOGIN_SUBMIT, data);
        });
    }

    /**
     * Обработка в случае провала
     */
    _onNoLogin() {
        // ToDo(Алексей Егоров): Неправильная почта или пароль
        console.log('wrong email or password');
    }
}
