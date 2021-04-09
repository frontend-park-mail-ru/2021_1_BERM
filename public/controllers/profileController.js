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
import {MAIN_PAGE} from '../modules/utils/pageNames.js';

/** Контроллер регистрации клиента */
export class ProfileController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new ProfileView();
    }

    /**
     * Запуск контроллера профиля
     */
    run() {
        super.run(
            [
                [PROFILE, this._profile],
                [ON_PROFILE, this._onProfile],
                [IMG_CHANGE, this._changeImage],
                [IMG_LOAD, this._onLoadImage],
                [EXIT, this._onExit],
            ],
            true);
    }

    /**
     * Проверка наличия данных пользователя
     */
    _profile() {
        if (!user.isGetAttr) {
            auth.getProfile(user.id);
        } else {
            eventBus.emit(RENDER_PROFILE, {
                isAuthorized: user.isAuthorized,
                name: user.nameSurname,
                login: user.login,
                isExecutor: user.isExecutor,
                specializes: user.specializes,
                about: user.about,
                img: user.img,
                rating: 0,
                reviews: 0,
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
                    nameSurname: res.name_surname,
                    login: res.login,
                    isExecutor: res.executor,
                    specializes: res.specializes,
                    about: res.about,
                    img: res.img,
                    email: res.email,
                };

                user.setAttributes(data);

                eventBus.emit(RENDER_PROFILE, {
                    isAuthorized: user.isAuthorized,
                    name: user.nameSurname,
                    login: user.login,
                    isExecutor: user.isExecutor,
                    specializes: user.specializes,
                    about: user.about,
                    img: user.img,
                    rating: 0,
                    reviews: 0,
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
        router.go(MAIN_PAGE);
    }
}
