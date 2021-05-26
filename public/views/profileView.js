import {View} from './view.js';
import eventBus from '@/modules/eventBus.js';
import {notification} from '@/components/notification/notification.js';
import {
    PROFILE_EXIT,
    FAIL_LOAD_IMG,
    PROFILE_IMG_CHANGE,
    PROFILE_GO,
    PROFILE_DELETE_SPEC,
    RENDER_PROFILE,
    SUCCESS_LOAD_IMG, SERVER_ERROR,
} from '@/modules/constants/actions.js';

import profileTemplate from '@/components/pages/profile/profile.pug';

/** View профиля */
export class ProfileView extends View {
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
            [RENDER_PROFILE, this._renderProfile.bind(this)],
            [SUCCESS_LOAD_IMG, this._successLoadImage.bind(this)],
            [FAIL_LOAD_IMG, this._failLoadImage.bind(this)],
            [SERVER_ERROR, this._notti.bind(this)],
        ]);

        eventBus.emit(PROFILE_GO);
    }

    /**
     * Отображения данных пользователя
     *
     * @param {Object} info - объект с информацией пользователя
     */
    _renderProfile(info) {
        super.renderHtml(
            info.isAuthorized,
            info.isExecutor,
            'Профиль',
            profileTemplate(info),
        );

        if (info.isMyProfile) {
            const inputImg = document.getElementById('input-file');
            inputImg.onchange = async (ev) => {
                const file = ev.target.files[0];
                const fReader = new FileReader();
                fReader.onload = () => {
                    eventBus.emit(PROFILE_IMG_CHANGE, fReader.result);
                };
                await fReader.readAsDataURL(file);
            };

            const exitLink = document.querySelector('.exit-buttion__text');
            exitLink.addEventListener('click', () => {
                eventBus.emit(PROFILE_EXIT);
            });
        }

        if (info.isMyProfile && this.isExecutor) {
            const closeSpec =
                document.getElementsByClassName('specializes__close');

            [].forEach.call(closeSpec, (item) => {
                item.addEventListener('click', (event) => {
                    const data = event.target.parentNode.children[1].innerHTML;

                    eventBus.emit(PROFILE_DELETE_SPEC, data);
                });
            });
        }
    }

    /**
     * Отображение успешной загрузки картинки
     *
     * @param {string} src - форма
     */
    _successLoadImage(src) {
        const img = document.getElementById('profile_img');
        img.src = src;
    }

    /**
     * Отображение неуспешной загрузки картинки
     */
    _failLoadImage() {
        notification('Ошибка сервера. Картинка не загружена');
    }

    /**
     * Отображение нотификаций
     *
     * @param {string}str
     */
    _notti(str) {
        notification(str);
    }
}
