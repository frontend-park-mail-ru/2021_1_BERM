import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import {
    EXIT,
    FAIL_LOAD_IMG,
    IMG_CHANGE,
    PROFILE,
    RENDER_PROFILE,
    SUCCESS_LOAD_IMG,
} from '../modules/utils/actions.js';

import profileTemplate from '@/components/pages/profile.pug';

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
        ]);

        eventBus.emit(PROFILE);
    }

    /**
     * Отображения данных пользователя
     *
     * @param {Object} info - объект с информацией пользователя
     */
    _renderProfile(info) {
        super.renderHtml(
            this.isAuthorized,
            this.isExecutor,
            'Профиль',
            profileTemplate(info),
        );

        if (info.isMyProfile) {
            const inputImg = document.getElementById('input-file');
            inputImg.onchange = async (ev) => {
                const file = ev.target.files[0];
                const fReader = new FileReader();
                fReader.onload = () => {
                    eventBus.emit(IMG_CHANGE, fReader.result);
                };
                await fReader.readAsDataURL(file);
            };

            const exitLink = document.querySelector('.exit-buttion__text');
            exitLink.addEventListener('click', () => {
                eventBus.emit(EXIT);
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
        // ToDo: Отобразить. Не удалось загрузить изображение
        console.log('Не удалось загрузить изображение');
    }
}
