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

import profileTemplate from '@/components/profile.pug';
import defaultImg from '@/static/img/profileAvatar.svg';

/** View профиля */
export class ProfileView extends View {
    /**
     * Отображение страницы и получение с нее данных
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [RENDER_PROFILE, this._renderProfile],
            [SUCCESS_LOAD_IMG, this._successLoadImage],
            [FAIL_LOAD_IMG, this._failLoadImage],
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
            info.isAuthorized,
            info.isExecutor,
            'Профиль',
            profileTemplate(info),
        );

        const img = document.querySelector('div.top__avatar');
        if (info.img === null || info.img === undefined) {
            img.style.background =
                `url(${defaultImg}).default}) 
                no-repeat;`;
        } else {
            // img.src.background = info.img;
        }

        const inputImg = document.getElementById('file-input');
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

    /**
     * Отображение успешной загрузки картинки
     *
     * @param {string} src - форма
     */
    _successLoadImage(src) {
        const img = document.getElementById('profile_img');
        img.style.background= `image(${src}) no-repeat;`;
    }

    /**
     * Отображение неуспешной загрузки картинки
     */
    _failLoadImage() {
        // ToDo: Отобразить. Не удалось загрузить изображение
        console.log('Не удалось загрузить изображение');
    }
}
