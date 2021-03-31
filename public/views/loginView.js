import {View} from './view.js';

import eventBus from '../modules/eventBus.js';
import {
    LOGIN,
    LOGIN_SUBMIT,
    NO_LOGIN,
} from '../modules/utils/actions.js';

export class LoginView extends View {
    render() {
        super.renderHtml(
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

    _onNoLogin() {
        // ToDo(Алексей Егоров): Неправильная почта или пароль
        console.log('wrong email or password');
    }
}
