import {View} from './view.js';

import eventBus from "../modules/eventBus.js";

export class LoginView extends View {
    render() {
        super.renderHtml(navbarTemplate() + loginTemplate());

        const form = document.getElementById('login__window');
        form.addEventListener('submit', (event) => {
            const data = {
                email: event.target.email.value,
                password: event.target.password.value,
            };

            eventBus.emit('login-submit', data);
        });

        this.listeners = new Set([
            ['no-login', this._onNoLogin],
        ]);

        super.onAll()
    }

    _onNoLogin() {
        // ToDo(Алексей Егоров): Неправильная почта или пароль
        console.log('wrong email or password');
    }
}