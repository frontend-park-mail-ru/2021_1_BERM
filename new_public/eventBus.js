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

    off(event, callback) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event]
            .filter((listener) => {
                return listener.callback !== callback;
            })
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