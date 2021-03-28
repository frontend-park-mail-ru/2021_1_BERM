import eventBus from "../modules/eventBus.js";
import {sendRequest} from "../modules/ajax.js";

export default class Reg {
    // static isRegistered () {
    //     return sendRequest('GET', '/authorized');
    // }

    static reg(data) {
        sendRequest('POST', '/profile', JSON.parse(JSON.stringify(data)))
            .then((res) => {
                eventBus.emit('registered', res);
            });
    }


}
