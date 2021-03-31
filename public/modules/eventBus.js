// ToDo(Алексей Егоров): Добавить JsDoc.

/** Event Bus */
class EventBus {
    /**
     * Конструктор
     */
    constructor() {
        this.listeners = {};
    }

    /**
     * Добавляет слушателя на события
     *
     * @param {string} event - имя события
     * @param {function} callback - callback
     */
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }

        this.listeners[event].push({
            callback: callback,
        });
    }

    /**
     * Удаляет все слушателей
     */
    off() {
        this.listeners = {};
    }

    /**
     * Добавляет слушателя на события
     *
     * @param {string} event - имя события
     * @param {Object} data - аргументы callback
     */
    emit(event, data = {}) {
        if (!this.listeners[event]) {
            return;
        }

        this.listeners[event].forEach(({callback}) => {
            callback(data);
        });
    }
}

export default new EventBus();
