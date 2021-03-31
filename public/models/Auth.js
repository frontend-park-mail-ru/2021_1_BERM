import eventBus from "../modules/eventBus.js";
import {sendRequest} from "../modules/ajax.js";
import User from "./User.js";
import {IMG_LOAD, LOGIN, ON_PROFILE, ORDER_CREATE, REG, SETTING_UPD} from "../modules/utils/actions.js";

export default class Auth {
    static isAuthorized() {
        return sendRequest('GET', '/authorized');
    }

    static login(data) {
        sendRequest('POST', '/login', data)
            .then((res) => {
                eventBus.emit(LOGIN, res);
            });
    }

    static reg(data) {
        sendRequest('POST', '/profile', data)
            .then((res) => {
                eventBus.emit(REG, res);
            });
    }

    static getProfile(id) {
        sendRequest('GET', `/profile/${id}`)
            .then((res) => {
                eventBus.emit(ON_PROFILE, res);
            });
    }

    static sendImage(src) {
        sendRequest('POST', '/profile/avatar', {img: src})
            .then((res) => {
                eventBus.emit(IMG_LOAD, {res, src});
            })
    }

    static logout() {
        return sendRequest('DELETE', `/logout`);
    }

    static updateSettings(data) {
        sendRequest('PATCH', `/profile/${User.id}`, data)
            .then((res) => {
                eventBus.emit(SETTING_UPD, res);
            });
    }

    static createOrder(data) {
        sendRequest('POST', '/order', data)
            .then((res) => {
                eventBus.emit(ORDER_CREATE, res);
            });
    }
}
