import {Controller} from './controller.js';
import auth from '../models/Auth.js';
import eventBus from '../modules/eventBus.js';
import user from '../models/User.js';
import {ProfileView} from '../views/profileView.js';
import router from '../modules/router.js';
import {
    EXIT, FAIL_LOAD_IMG,
    IMG_CHANGE,
    IMG_LOAD,
    ON_PROFILE,
    PROFILE,
    RENDER_PROFILE,
    SUCCESS_LOAD_IMG,
} from '../modules/utils/actions.js';

/** Контроллер регистрации клиента */
export class ProfileController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
    }

    /**
     * Запуск контроллера профиля
     */
    run() {
        if (!user.isAuthorized) {
            router.go('login');
            return;
        }

        super.run(
            new ProfileView(),
            [
                [PROFILE, this._Profile],
                [ON_PROFILE, this._onProfile],
                [IMG_CHANGE, this._changeImage],
                [IMG_LOAD, this._onLoadImage],
                [EXIT, this._onExit],
            ]);
    }

    /**
     * Проверка наличия данных пользователя
     */
    _Profile() {
        if (!user.isGetAttr) {
            auth.getProfile(user.id);
        } else {
            eventBus.emit(RENDER_PROFILE, {
                name: user.first_name + ' ' + user.second_name,
                nickName: user.nickName,
                isExecutor: user.isExecutor,
                specialize: user.specializes,
                about: user.about,
                img: user.img,
            });
        }
    }

    /**
     * Получение данных профиля с сервера
     *
     * @param {Response} res - результат запроса
     */
    _onProfile(res) {
        if (!res.ok) {
            // ToDo: Косяк
            console.log('Косяк');
            return;
        }

        res.json()
            .then((res) => {
                const data = {
                    first_name: res.first_name,
                    second_name: res.second_name,
                    nickName: res.user_name,
                    isExecutor: res.executor,
                    specialize: res.specializes,
                    about: res.about,
                    img: res.img_url,
                    email: 'email@email.ru', // ToDo FIX
                };

                user.setAttributes(data);

                eventBus.emit(RENDER_PROFILE, {
                    name: user.first_name + ' ' + user.second_name,
                    nickName: user.nickName,
                    isExecutor: user.isExecutor,
                    specialize: user.specializes,
                    about: user.about,
                    img: user.img,
                });
            });
    }

    /**
     * Изменение картинки
     *
     * @param {string} src - изображение
     */
    _changeImage(src) {
        auth.sendImage(src);
    }

    /**
     * Получение изображения с сервера
     *
     * @param {string} src - изображение
     * @param {Response} res - результат запроса
     */
    _onLoadImage({res, src}) {
        if (res.ok) {
            user.img = src;
            eventBus.emit(SUCCESS_LOAD_IMG, src);
        } else {
            eventBus.emit(FAIL_LOAD_IMG);
        }
    }

    /**
     * Обработка выхода пользователя
     */
    _onExit() {
        auth.logout()
            .catch((res) => {
                console.log('не удалось parse JSON', res.message);
            });
        user.isAuthorized = false;
        user.isGetAttr = false;
        router.go('main-page');
    }
}
