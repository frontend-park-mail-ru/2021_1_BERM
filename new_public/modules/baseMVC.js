import eventBus from './eventBus.js'

export class BaseMVC {
    /**
     * Добавляет слушателей на события
     * @author Егоров Алексей
     */
    onAll() {
        if (!this.listeners) {
            return;
        }

        this.listeners
            .forEach((event) => {
                eventBus.on(event[0], event[1]);
            });
    }

    /**
     * Удаляет слушателей событий
     * @author Егоров Алексей
     */
    offAll() {
        if (!this.listeners) {
            return;
        }

        eventBus.off();
    }
}