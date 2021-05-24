import eventBus from '@/modules/eventBus.js';
import {sendRequest} from '@/modules/ajax.js';
import User from './User.js';
import {
    PROFILE_IMG_GET,
    LOGIN_GET,
    PROFILE_GET,
    ORDER_CREATE_GET,
    ORDER_GET_RATE,
    ORDER_PAGE_RES,
    REGISTRATION_GET,
    ORDER_GET,
    SEND_RESULT_RENDER,
    SETTING_GET,
    VACANCY_CREATE,
    VACANCY_PAGE_RES,
    VACANCY_PAGE_GET_VACANCY,
    SELECT_SPEC_SET,
    PROFILE_DELETE_SPEC_GET,
    ORDER_GET_EXECUTOR,
    ORDER_GET_DELETE_EXECUTOR,
    SEND_RESULT_RENDER_VACANCIES,
    VACANCY_GET_RATE,
    VACANCY_GET_EXECUTOR,
    VACANCY_GET_DELETE_EXECUTOR,
    ORDER_PAGE_GET_RES,
    NOTIF_CHANGE_VALID, ARCHIVE_GET_VACANCIES,
} from '@/modules/constants/actions.js';


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
                eventBus.emit(LOGIN_GET, res);
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
                eventBus.emit(REGISTRATION_GET, res);
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
                eventBus.emit(PROFILE_GET, res);
            });
    }

    /**
     * Отправка результата
     *
     * @param {string} data - код изображения на отправку
     */
    static sendImage(data) {
        sendRequest('PATCH', '/profile/avatar', data)
            .then((res) => {
                eventBus.emit(PROFILE_IMG_GET, {
                    res: res,
                    src: data.img,
                });
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
        sendRequest('PATCH', `/profile/${User.id}`, data)
            .then((res) => {
                eventBus.emit(SETTING_GET, res);
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
                eventBus.emit(ORDER_CREATE_GET, res);
            });
    }

    /**
     * Получение откликов заказа
     *
     * @param {number} id - уникальный номер заказа
     */
    static getResponsesOrder(id) {
        sendRequest('GET', `/order/${id}/response`)
            .then((res) => {
                eventBus.emit(ORDER_PAGE_RES, res);
            });
    }

    /**
     * Запрос на все заказы
     */
    static getOrders() {
        sendRequest('GET', '/order')
            .then((res) => {
                eventBus.emit(SEND_RESULT_RENDER, res);
            });
    }

    /**
     * Запрос на заказы пользователя
     *
     * @param {number} id - уникальный номер пользователя
     */
    static getMyOrders(id) {
        sendRequest('GET', `/order/profile/${id}`)
            .then((res) => {
                eventBus.emit(SEND_RESULT_RENDER, res);
            });
    }

    /**
     * Запрос на вакансии пользователя
     *
     * @param {number} id - уникальный номер пользователя
     */
    static getMyVacancies(id) {
        sendRequest('GET', `/vacancy/profile/${id}`)
            .then((res) => {
                eventBus.emit(SEND_RESULT_RENDER_VACANCIES, res);
            });
    }

    /**
     * Устанавливаем отклик
     *
     * @param {Object} data - данные на отправку
     * @param {number} id - уникальный номер заказа
     */
    static setResponse(data, id) {
        sendRequest('POST', `/order/${id}/response`, data)
            .then((res) => {
                eventBus.emit(ORDER_GET_RATE, res);
            });
    }

    /**
     * Удаляем ставку
     *
     * @param {number} id - уникальный номер заказа
     *
     * @return {Object}
     */
    static deleteRate(id) {
        return sendRequest('DELETE', `/order/${id}/response`);
    }

    /**
     * Изменяем ставку
     *
     * @param {Object} data - данные на отправку
     * @param {number} id - уникальный номер заказа
     */
    static changeResponse(data, id) {
        sendRequest('PATCH', `/order/${id}/response`, data)
            .then((res) => {
                eventBus.emit(ORDER_GET_RATE, res);
            });
    }

    /**
     * Запрос на заказ
     *
     * @param {number} id - уникальный номер заказ
     */
    static getOrder(id) {
        sendRequest('GET', `/order/${id}`)
            .then((res) => {
                eventBus.emit(ORDER_GET, res);
            });
    }

    /**
     * Создаем вакансию
     *
     * @param {Object} data - данные на отправку
     */
    static vacancyCreate(data) {
        sendRequest('POST', '/vacancy', data)
            .then((res) => {
                eventBus.emit(VACANCY_CREATE, res);
            });
    }

    /**
     * Получаем отклики вакансии
     *
     * @param {number} id - уникальный номер вакансии
     */
    static getResponsesVacancy(id) {
        sendRequest('GET', `/vacancy/${id}/response`)
            .then((res) => {
                eventBus.emit(VACANCY_PAGE_RES, res);
            });
    }

    /**
     * Получаем данные вакансии
     *
     * @param {number} id - уникальный номер вакансии
     */
    static getVacancy(id) {
        sendRequest('GET', `/vacancy/${id}`)
            .then((res) => {
                eventBus.emit(VACANCY_PAGE_GET_VACANCY, res);
            });
    }

    /**
     * Устанавливаем новую ставку.
     *
     * @param {Object} data
     * @param {number} id
     */
    static vacancySetResponse(data, id) {
        sendRequest('POST', `/vacancy/${id}/response`, data)
            .then((res) => {
                eventBus.emit(VACANCY_GET_RATE, res);
            });
    }

    /**
     * Запрос на удаление ставки
     *
     * @param {number} id вакансии
     *
     * @return {Promise}
     */
    static vacancyDeleteRate(id) {
        return sendRequest('DELETE', `/vacancy/${id}/response`);
    }

    /**
     * Изменяем ставку.
     *
     * @param {number} id вакансии
     * @param {Object} data - данные
     */
    static vacancyChangeResponse(id, data) {
        sendRequest('PATCH', `/vacancy/${id}/response`, data)
            .then((res) => {
                eventBus.emit(VACANCY_GET_RATE, res);
                eventBus.emit(NOTIF_CHANGE_VALID, res);
            });
    }

    /**
     * Выбираем исполнителя.
     *
     * @param {number} id вакансии
     * @param {Object} data - данные
     */
    static vacancySetExecutor(id, data) {
        sendRequest('POST', `/vacancy/${id}/select`, data)
            .then((res) => {
                eventBus.emit(VACANCY_GET_EXECUTOR, res);
            });
    }

    /**
     * Отменяем ислонителя
     * @param {number} id вакансии
     */
    static vacancyDeleteExecutor(id) {
        sendRequest('DELETE', `/vacancy/${id}/select`)
            .then((res) => {
                eventBus.emit(VACANCY_GET_DELETE_EXECUTOR, res);
            });
    }

    /**
     * Устанавливаем специализацию
     *
     * @param {number} id - уникальный номер пользователя
     * @param {Object} data - данные на отправку
     */
    static setSpec(id, data) {
        sendRequest('POST', `/profile/${id}/specialize`, data)
            .then((res) => {
                eventBus.emit(SELECT_SPEC_SET, res);
            });
    }

    /**
     * Удаляем специализацию
     *
     * @param {number} id - уникальный номер пользователя
     * @param {Object} data - данные на отправку
     */
    static deleteSpec(id, data) {
        sendRequest('DELETE', `/profile/${id}/specialize`, data)
            .then((res) => {
                eventBus.emit(PROFILE_DELETE_SPEC_GET, res);
            });
    }

    /**
     * Устанавливаем выбранного исполнителя
     *
     * @param {number} id - уникальный номер заказа
     * @param {Object} data - данные на отправку
     */
    static setOrderExecutor(id, data) {
        sendRequest('POST', `/order/${id}/select`, data)
            .then((res) => {
                eventBus.emit(ORDER_GET_EXECUTOR, res);
            });
    }

    /**
     * Удаляем выбранного исполнителя
     *
     * @param {number} id - уникальный номер заказа
     */
    static deleteOrderExecutor(id) {
        sendRequest('DELETE', `/order/${id}/select`)
            .then((res) => {
                eventBus.emit(ORDER_GET_DELETE_EXECUTOR, res);
            });
    }

    /**
     * Получаем информацию о вакансиях
     */
    static getVacancies() {
        sendRequest('GET', '/vacancy')
            .then((res) => {
                eventBus.emit(SEND_RESULT_RENDER_VACANCIES, res);
            });
    }

    /**
     * Запрос на завершение заказа
     *
     * @param {number} id - уникальный номер заказа
     *
     * @return {Promise} - ответ от сервера
     */
    static endOrder(id) {
        return sendRequest('DELETE', `/order/${id}/close`);
    }

    /**
     * Запрос на удаление заказа
     *
     * @param {number} id - уникальный номер заказа
     *
     * @return {Promise} - ответ от сервера
     */
    static deleteOrder(id) {
        return sendRequest('DELETE', `/order/${id}`);
    }

    /**
     * Отправка данных отзыва на сервер
     *
     * @param {Object} data - содержание отзыва
     *
     * @return {Promise} - ответ от сервера
     */
    static sendFeedback(data) {
        return sendRequest('POST', '/profile/review', data);
    }

    /**
     * Получения архива заказов
     *
     * @param {number} id профиля
     *
     */
    static getArchiveOrders(id) {
        sendRequest('GET', `/order/profile/${id}/archive`)
            .then((res) => {
                eventBus.emit(SEND_RESULT_RENDER, res);
            });
    }

    static getArchiveVacancies(id) {
        sendRequest('GET', `/vacancy/profile/${id}/archive`)
            .then((res) => {
                eventBus.emit(ARCHIVE_GET_VACANCIES, res);
            });
    }

    /**
     * Получение отзывов
     *
     * @param {number} id профиля
     *
     * @return {Promise} - ответ от сервера
     */
    static getReviews(id) {
        return sendRequest('GET', `/profile/${id}/review`);
    }

    /**
     * Запрос на завершение вакансии
     *
     * @param {number} id - уникальный номер вакансии
     *
     * @return {Promise} - ответ от сервера
     */
    static endVacancy(id) {
        return sendRequest('DELETE', `/vacancy/${id}/close`);
    }

    /**
     * Запрос на удаление вакансии
     *
     * @param {number} id - уникальный номер вакансии
     *
     * @return {Promise} - ответ от сервера
     */
    static deleteVacancy(id) {
        return sendRequest('DELETE', `/vacancy/${id}`);
    }

    /**
     * Изменение вакансии
     *
     * @param {number} id вакансии
     * @param {Object} info - данные на отправку
     */
    static changeVacancy(id, info) {
        sendRequest('PATCH', `/vacancy/${id}`, info)
            .then((res) => {
                eventBus.emit(VACANCY_PAGE_GET_VACANCY, res);
            });
    }

    /**
     * Изменение вакансии
     *
     * @param {number} id заказа
     * @param {Object} info - данные на отправку
     */
    static changeOrder(id, info) {
        sendRequest('PATCH', `/order/${id}`, info)
            .then((res) => {
                eventBus.emit(ORDER_PAGE_GET_RES, res);
            });
    }

    /**
     * Поиск по заказам
     *
     * @param {Object} data - данные на отправку
     * @return {Promise} - ответ от сервера
     */
    static searchOrders(data) {
        return sendRequest('PATCH', `/order/search`, data);
    }

    /**
     * Поиск по вакансиям
     *
     * @param {Object} data - данные на отправку
     * @return {Promise} - ответ от сервера
     */
    static searchVacancies(data) {
        return sendRequest('PATCH', `/vacancy/search`, data);
    }

    static searchAllOrders(query) {
        return sendRequest('GET', `/order${query}`);
    }

    static searchAllVacancies(query) {
        return sendRequest('GET', `/vacancy${query}`);
    }
}
