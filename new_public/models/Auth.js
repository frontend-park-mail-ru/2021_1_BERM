import eventBus from "../modules/eventBus.js";
import {sendRequest} from "../modules/ajax.js";

class Auth {
    constructor() {
    }

    login(data) {
        sendRequest('POST', '/login', JSON.parse(JSON.stringify(data)))
            .then((res) => {
                eventBus.emit('login', res);
            });
    }
}

export default new Auth();
