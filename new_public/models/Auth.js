import eventBus from "../modules/eventBus.js";
import {sendRequest} from "../modules/ajax.js";
import ajax from "../../public/js/modules/ajax";

export default class Auth {
    static isAuthorized() {
        return sendRequest('GET', '/authorized');
    }

    static login(data) {
        sendRequest('POST', '/login', JSON.parse(JSON.stringify(data)))
            .then((res) => {
                eventBus.emit('login', res);
            });
    }

    static reg(data) {
        sendRequest('POST', '/profile', JSON.parse(JSON.stringify(data)))
            .then((res) => {
                eventBus.emit('registered', res);
            });
    }

    static getProfile(id) {
        sendRequest('GET', `/profile/${id}`)
            .then((res) => {
                eventBus.emit('onProfile', res);
            });
    }

    static sendImage(src) {
        sendRequest('POST', '/profile/avatar', JSON.parse(JSON.stringify({img: src})))
            .then((res) => {
                eventBus.emit('load-image', {res, src});
            })
    }

    static logout() {
        return ajax.sendRequest('DELETE', `/logout`);
    }
}
