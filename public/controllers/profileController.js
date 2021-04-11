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
        this.view = new ProfileView();
    }

    /**
     * Запуск контроллера профиля
     *
     * @param {string} id - id пользователя
     */
    run(id) {
        this.id = Number(id);

        super.run(
            [
                [PROFILE, this._profile.bind(this)],
                [ON_PROFILE, this._onProfile.bind(this)],
                [IMG_CHANGE, this._changeImage.bind(this)],
                [IMG_LOAD, this._onLoadImage.bind(this)],
                [EXIT, this._onExit.bind(this)],
            ],
            true);
    }

    /**
     * Проверка наличия данных пользователя
     */
    _profile() {
        if (!user.isGetAttr || this.id !== user.id) {
            user.isGetAttr = true;
            auth.getProfile(this.id);
        } else {
            eventBus.emit(RENDER_PROFILE, {
                isMyProfile: this.id === user.id,
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

                if (this.id === user.id) {
                    user.setAttributes(data);
                }

                eventBus.emit(RENDER_PROFILE, {
                    isMyProfile: this.id === user.id,
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
        router.go('/');
    }
}
