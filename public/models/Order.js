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

        res.forEach((item) => {
            this.pushResponse(id, item);
        });

        this.ordersMap.get(id).responses = responses;
    }

    pushResponse(id, item) {
        const dataRes = {
            creatorId: item.user_id,
            avatar: item.user_img,
            login: item.user_login,
            rate: item.rate,
            date: this.getDate(item.time),
        };

        this.ordersMap.get(id).responses.push(dataRes);
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
                date: this.getDate(res.deadline),
                budget: res.budget,
            });
        });
    }

    getOrderById(id) {
        return this.ordersMap.get(id);
    }

    findMin(id) {
        let min = {rate: -1};

        this.ordersMap.get(id).responses.forEach((item) => {
            if (min.rate === -1 || item.rate < min.rate) {
                min = item;
            }
        });

        return min;
    }

    getDate(time) {
        const date = new Date(time);
        let day = date.getDate();
        if (day < 10) {
            day = `0${day}`;
        }
        let month = date.getMonth();
        if (month < 9) {
            month = `0${month + 1}`;
        }
        const year = date.getFullYear();

        return `${day}:${month}:${year}`;
    }
}

export default new Order();
