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
        const responses = [];
        let min = {rate: -1};

        res.forEach((item) => {
            const dataRes = {
                creatorId: item.user_id,
                avatar: item.user_img,
                login: item.user_login,
                rate: item.rate,
                date: new Date(item.time * 1000),
            };

            if (item.rate > min.rate) {
                min = dataRes;
            }
            responses.push(dataRes);
        });

        this.ordersMap.get(id).responses = responses;
        this.ordersMap.get(id).minResponse = min;
    }

    pushResponse(item) {
        const dataRes = {
            creatorId: item.user_id,
            avatar: item.user_img,
            login: item.user_login,
            rate: item.rate,
            date: new Date(item.time * 1000),
        };

        this.ordersMap.get(this.currentOrderId).responses.push(dataRes);
    }

    findRate(id, creatorId) {
        this.ordersMap.get(id).responses.forEach((item) => {
            if (item.creatorId === creatorId) {
                return item.rate;
            }
        });
        return 0;
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

    getOrderById(id) {
        return this.ordersMap.get(id);
    }
}

export default new Order();
