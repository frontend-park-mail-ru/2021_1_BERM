/** Класс пользователя */
class User {
    /**
     * Конструктор
     */
    constructor() {
        this.isGetAttr = false;
        this.isAuthorized = false;
        this.specializes = [];
        this.id = 0;
    }

    /**
     * Установка атрибутов пользователя
     *
     * @param {Object} attr - результат запроса
     */
    setAttributes(attr) {
        for (const [key, value] of Object.entries(attr)) {
            this[key] = value;
        }
        this.isGetAttr = true;
    }

    /**
     * Удаление специализации
     *
     * @param {string} spec - специализация
     */
    deleteSpec(spec) {
        let pos = -1;
        this.specializes.forEach((item, i) => {
            if (item === spec) {
                pos = i;
            }
        });

        this.specializes.splice(pos, 1);
        if (!this.specializes) {
            this.specializes = [];
        }
    }
}

export default new User();
