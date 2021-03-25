import eventBus from "../modules/eventBus.js";
import {sendRequest} from "../modules/ajax.js";

export default class Auth {
    static login(data) {
        sendRequest('POST', '/login', JSON.parse(JSON.stringify(data)))
            .then((res) => {
                eventBus.emit('login', res);
            });
    }
}
