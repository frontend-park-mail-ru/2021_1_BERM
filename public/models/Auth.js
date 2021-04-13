import eventBus from '../modules/eventBus.js';
import {sendRequest} from '../modules/ajax.js';
import User from './User.js';
import {
    IMG_LOAD,
    LOGIN,
    ON_PROFILE,
    ORDER_CREATE,
    ORDER_GET_RATE,
    ORDER_PAGE_RES,
    REG,
    ORDER_GET,
    SEND_RESULT_RENDER,
    SETTING_UPD,
    VACANCY_CREATE,
    VACANCY_PAGE_RES,
    VACANCY_PAGE_GET_VACANCY, SELECT_SPEC_SET, PROFILE_DELETE_SPEC_GET,
} from '../modules/utils/actions.js';

/** Singleton класс, который делает запрос на сервер и отдает
 * результат контроллеру */
export default class Auth {
    /**
     * Запрос на проверку авторизации
     * @return {Object}
     */
    static isAuthorized() {
        return sendRequest('GET', '/profile/authorized');
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
        sendRequest('PUT', '/profile/avatar', {img: src})
            .then((res) => {
                eventBus.emit(IMG_LOAD, {res, src});
            });
    }

    /**
     * Отправка запроса на logout
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
        sendRequest('PUT', `/profile/${User.id}`, data)
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

    static getResponsesOrder(id) {
        sendRequest('GET', `/order/${id}/response`)
            .then((res) => {
                eventBus.emit(ORDER_PAGE_RES, res);
            });
    }

    static getOrders() {
        sendRequest('GET', '/order')
            .then((res) => {
                eventBus.emit(SEND_RESULT_RENDER, res);
            });
    }

    static setResponse(data, id) {
        sendRequest('POST', `/order/${id}/response`, data)
            .then((res) => {
                eventBus.emit(ORDER_GET_RATE, res);
            });
    }

    static deleteRate(id) {
        return sendRequest('DELETE', `/order/${id}/response`);
    }

    static changeResponse(data, id) {
        sendRequest('PUT', `/order/${id}/response`, data)
            .then((res) => {
                eventBus.emit(ORDER_GET_RATE, res);
            });
    }

    static getOrder(id) {
        sendRequest('GET', `/order/${id}`)
            .then((res) => {
                eventBus.emit(ORDER_GET, res);
            });
    }

    static vacancyCreate(data) {
        sendRequest('POST', '/vacancy', data)
            .then((res) => {
                eventBus.emit(VACANCY_CREATE, res);
            });
    }

    static getResponsesVacancy(id) {
        sendRequest('GET', `/vacancy/${id}/response`)
            .then((res) => {
                eventBus.emit(VACANCY_PAGE_RES, res);
            });
    }

    static getVacancy(id) {
        sendRequest('GET', `/vacancy/${id}`)
            .then((res) => {
                eventBus.emit(VACANCY_PAGE_GET_VACANCY, res);
            });
    }

    static setSpec(id, data) {
        sendRequest('POST', `/profile/${id}/specialize`, data)
            .then((res) => {
                eventBus.emit(SELECT_SPEC_SET, res);
            });
    }

    static deleteSpec(id, data) {
        sendRequest('DELETE', `/profile/${id}/specialize`, data)
            .then((res) => {
                eventBus.emit(PROFILE_DELETE_SPEC_GET, res);
            });
    }
}
