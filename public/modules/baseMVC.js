import eventBus from './eventBus.js';

/** Базовый класс от которого наследуются контроллеры и views */
export class BaseMVC {
    /**
     * Конструктор
     */
    constructor() {
        this.listeners = {};
    }

    /**
     * Добавляет слушателей на события
     */
    onAll() {
        if (!this.listeners) {
            return;
        }

        [...this.listeners]
            .forEach((event) => {
                eventBus.on(event[0], event[1]);
            });
    }

    /**
     * Удаляет слушателей событий
     */
    offAll() {
        if (!this.listeners) {
            return;
        }

        eventBus.off();
    }
}
