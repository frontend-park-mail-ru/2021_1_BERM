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
        this.ordersMap.set(attr.id, attr);
        this.currentOrderId = attr.id;
    }

    setResponses(id, res) {
        // ToDo Если хотим названия полей нормальные,
        //  то надо пройтись по res
        this.ordersMap[id].responses = res;
    }

    setOrders(data) {
        data.forEach((res) => {
            this.setAttributes({
                id: res.id,
                avatar: res.img,
                login: res.login,
                name: res.order_name,
                customerId: res.customer_id,
                category: res.category,
                definition: res.description,
                date: res.deadline,
                budget: res.budget,
            });
        });
    }
}

export default new Order();
