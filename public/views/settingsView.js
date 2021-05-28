import {View} from './view.js';
import {Validator} from './validation/validator.js';
import eventBus from '@/modules/eventBus.js';
import {
    GET_USER_DATA,
    NO_SET_UP, SETTING_INVALID_PASSWORD,
    SETTING_SEND_DATA,
    SETTING_SUBMIT,
} from '@/modules/constants/actions.js';

import settingsTemplate from '@/components/pages/settings/settings.pug';
import {notification} from '@/components/notification/notification.js';

/** Контроллер регистрации клиента */
export class SettingsView extends View {
    /**
     * Отображение страницы и получение с нее данных
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        this.isAuthorized = isAuthorized;
        this.isExecutor = isExecutor;

        super.setListeners([
            [GET_USER_DATA, this._renderData.bind(this)],
            [NO_SET_UP, this._onNoSetUp.bind(this)],
            [SETTING_INVALID_PASSWORD, this._invalidPassword.bind(this)],
        ]);
        eventBus.emit(SETTING_SEND_DATA);
    }

    /**
     * Отображения данных пользователя
     *
     * @param {Object} info - объект с информацией пользователя
     */
    _renderData(info) {
        super.renderHtml(
            info.isAuthorized,
            info.isExecutor,
            'Настройки',
            settingsTemplate(info),
        );

        const val = new Validator(
            'settings-form',
            '.form-control',
            'send_mess',
        );
        val.validate();

        const form = document.getElementById('settings-form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                name_surname: event.target.name.value,
                password: event.target.oldPassword.value,
                login: event.target.login.value,
                about: event.target.about.value,
                new_password: event.target.password.value,
            };

            eventBus.emit(SETTING_SUBMIT, data);
        });
    }

    /**
     * Обработка в случае провала
     */
    _onNoSetUp() {
        notification('Ошибка сервера. Не удалось сохранить изменения');
    }

    /**
     * Обработка в случае провала
     */
    _invalidPassword() {
        // Todo Рисовать ошибку по другому
        notification('Ошибка! Неверный текущий пароль');
    }
}

