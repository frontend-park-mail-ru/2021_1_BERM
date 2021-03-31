/** Класс пользователя */
class User {
    /**
     * Конструктор
     */
    constructor() {
        this.isGetAttr = false;
        this.isAuthorized = false;
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
}

export default new User();
