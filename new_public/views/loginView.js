import {View} from './view.js';

import eventBus from "../modules/eventBus.js";

export class LoginView extends View {
    render() {
        // Todo(Алексей Егоров): Здесь вся отрисовка
        const root = document.getElementById('root');
        root.innerHTML = navbarTemplate() + loginTemplate();

        const form = document.getElementById('login__window');

        root.addEventListener('keyup', (event) => {
            if(event.keyCode === 13) { //  Enter
                form.submit();
            }
        });

        form.addEventListener('submit', (event) => {
            const data = {
                email: event.target.email.value,
                password: event.target.password.value,
            };
            debugger

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