import {Controller} from './controller.js';
import auth from '@/models/Auth.js';
import eventBus from '@/modules/eventBus.js';
import user from '@/models/User.js';
import {ProfileView} from '@/views/profileView.js';
import router from '@/modules/router.js';
import order from '@/models/Order.js';
import {
    PROFILE_EXIT, FAIL_LOAD_IMG,
    PROFILE_IMG_CHANGE,
    PROFILE_IMG_GET,
    PROFILE_GET,
    PROFILE_GO,
    PROFILE_DELETE_SPEC,
    PROFILE_DELETE_SPEC_GET,
    RENDER_PROFILE,
    SUCCESS_LOAD_IMG,
} from '@/modules/constants/actions.js';
import {getIndexPath, getNotFoundPath} from '@/modules/constants/goPath.js';
import {imgUrl} from '@/modules/constants/constants';

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
                [PROFILE_GO, this._profile.bind(this)],
                [PROFILE_GET, this._onProfile.bind(this)],
                [PROFILE_IMG_CHANGE, this._changeImage.bind(this)],
                [PROFILE_IMG_GET, this._onLoadImage.bind(this)],
                [PROFILE_EXIT, this._onExit.bind(this)],
                [PROFILE_DELETE_SPEC, this._sendDeleteSpec.bind(this)],
                [PROFILE_DELETE_SPEC_GET, this._getDeleteSpec.bind(this)],
            ],
            true);
    }

    /**
     * Проверка наличия данных пользователя
     */
    _profile() {
        auth.getProfile(this.id);
    }

    /**
     * Получение данных профиля с сервера
     *
     * @param {Response} res - результат запроса
     */
    _onProfile(res) {
        if (!res.ok) {
            router.go(getNotFoundPath);
            return;
        }

        res.json()
            .then((res) => {
                const data = {
                    id: res.id,
                    nameSurname: res.name_surname,
                    login: res.login,
                    isExecutor: res.executor,
                    specializes: res.specializes ? res.specializes : [],
                    about: res.about,
                    img: res.img ? imgUrl + res.img : undefined,
                    email: res.email,
                    ordersCount: res.orders_count,
                    reviewsCount: res.reviews_count,
                    rating: res.rating ? Number(res.rating.toFixed(2)) : 0,
                };

                if (this.id === user.id) {
                    user.setAttributes(data);
                }

                eventBus.emit(RENDER_PROFILE, {
                    id: data.id,
                    isMyProfile: this.id === user.id,
                    isAuthorized: user.isAuthorized,
                    name: data.nameSurname,
                    login: data.login,
                    isExecutor: data.isExecutor,
                    specializes: data.specializes,
                    about: data.about,
                    img: data.img,
                    rating: data.rating,
                    reviewsCount: data.reviewsCount,
                    ordersCount: data.ordersCount,
                });
            });
    }

    /**
     * Изменение картинки
     *
     * @param {string} src - изображение
     */
    _changeImage(src) {
        eventBus.emit(SUCCESS_LOAD_IMG, src);
        const delStr = src.split(',')[0];
        auth.sendImage({
            id: user.id,
            img: src.slice(delStr.length + 1),
        });
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
        } else {
            eventBus.emit(FAIL_LOAD_IMG);
        }
    }

    /**
     * Обработка выхода пользователя
     */
    _onExit() {
        auth.logout()
            .then(() => {
                user.isAuthorized = false;
                user.isGetAttr = false;
                order.currentOrderId = -1;
                order.getOrders = false;
                order.ordersMap = new Map([]);
                router.go(getIndexPath);
            })
            .catch((res) => {
                console.log('не удалось parse JSON', res.message);
            });
    }

    /**
     * Делаем запрос на удаление специализации
     *
     * @param {Object} data
     */
    _sendDeleteSpec(data) {
        this.deleteSpec = data;
        auth.deleteSpec(user.id, {name: data});
    }

    /**
     * Получаем ответ на удаление и выводим ошибку при неудаче
     *
     * @param {Response} res
     */
    _getDeleteSpec(res) {
        if (res.ok) {
            user.deleteSpec(this.deleteSpec);
            this._profile();
        }
    }
}
