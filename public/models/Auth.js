import eventBus from '../modules/eventBus.js';
import {sendRequest} from '../modules/ajax.js';
import User from './User.js';
import {
    IMG_LOAD,
    LOGIN,
    ON_PROFILE,
    ORDER_CREATE,
    REG,
    SETTING_UPD,
} from '../modules/utils/actions.js';

/** Синглтон класс, который делает запрос на сервер и отдает
 * результат контроллеру */
export default class Auth {
    /**
     * Конструктор
     * @return {Object}
     */
    static isAuthorized() {
        return sendRequest('GET', '/authorized');
    }

    /**
     * Отправка результата
     *
     * @param {Object} data - данные на отправку
     */
    static login(data) {
        sendRequest('POST', '/login', data)
            .then((res) => {
                eventBus.emit(LOGIN, res);
            });
    }

    /**
     * Отправка результата
     *
     * @param {Object} data - данные на отправку
     */
    static reg(data) {
        sendRequest('POST', '/profile', data)
            .then((res) => {
                eventBus.emit(REG, res);
            });
    }

    /**
     * Отправка результата
     *
     * @param {number} id - данные на отправку
     */
    static getProfile(id) {
        sendRequest('GET', `/profile/${id}`)
            .then((res) => {
                eventBus.emit(ON_PROFILE, res);
            });
    }

    /**
     * Отправка результата
     *
     * @param {string} src - код изображения на отправку
     */
    static sendImage(src) {
        sendRequest('POST', '/profile/avatar', {img: src})
            .then((res) => {
                eventBus.emit(IMG_LOAD, {res, src});
            });
    }

    /**
     * Отправка на разлогинивание
     * @return {Object}
     */
    static logout() {
        return sendRequest('DELETE', `/logout`);
    }

    /**
     * Отправка результата
     *
     * @param {Object} data - данные на отправку
     */
    static updateSettings(data) {
        sendRequest('PATCH', `/profile/${User.id}`, data)
            .then((res) => {
                eventBus.emit(SETTING_UPD, res);
            });
    }

    /**
     * Отправка результата
     *
     * @param {Object} data - данные на отправку
     */
    static createOrder(data) {
        sendRequest('POST', '/order', data)
            .then((res) => {
                eventBus.emit(ORDER_CREATE, res);
            });
    }
}
