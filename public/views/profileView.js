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

import profileTemplate from '@/templates/profile.pug';
import defaultImg from '@/static/img/profile.jpg';

/** Вьюха профиля */
export class ProfileView extends View {
    /**
     * Отображение страницы и получение с нее данных
     */
    render() {
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
     * @param {Object} info - форма
     */
    _renderProfile(info) {
        super.renderHtml(
            'Профиль',
            profileTemplate(info),
        );


        const img = document.getElementById('profile_img');
        if (info.img === null || info.img === undefined) {
            img.src = defaultImg;
        } else {
            img.src = info.img;
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

        const exitLink = document.getElementById('profile__exit_link');
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
