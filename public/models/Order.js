/** Класс для хранения заказа */
class Order {
    constructor() {
        this.currentOrderId = -1;
        this.ordersMap = new Map([]);
    }

    /**
     * Установка атрибутов пользователя
     *
     * @param {Object} attr - результат запроса
     */
    setAttributes(attr) {
        this.ordersMap[attr.id] = attr;
        this.currentOrderId = attr.id;
    }

    setResponses(id, res) {
        // ToDo Если хотим названия полей нормальные,
        //  то надо пройтись по res
        this.ordersMap[id].responses = res;
    }
}

export default new Order();
