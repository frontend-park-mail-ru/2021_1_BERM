// ToDo(Алексей Егоров): Добавить JsDoc.

class EventBus {
    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push({
            callback: callback
        });
    }

    off() {
        this.listeners = {};
    }

    emit(event, data) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event].forEach(({callback}) => {
            callback(data);
        })

    }
}

export default new EventBus();