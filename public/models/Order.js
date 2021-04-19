/** Класс для хранения заказа */
class Order {
    constructor() {
        this.currentOrderId = -1;
        this.ordersMap = new Map([]);
        this.getOrders = false;
    }

    /**
     * Установка атрибутов пользователя
     *
     * @param {Object} attr - результат запроса
     */
    setAttributes(attr) {
        this.ordersMap.set(Number(attr.id), attr);
        this.currentOrderId = Number(attr.id);
    }

    push(id, item) {
        this.ordersMap.get(id).responses.push(this.pushResponse(id, item));
    }

    setResponses(id, res) {
        const responses = [];

        res.forEach((item) => {
            responses.push(this.pushResponse(id, item));
        });

        this.ordersMap.get(id).responses = responses;
    }

    pushResponse(id, item) {
        return {
            id: item.id,
            creatorId: item.user_id,
            avatar: item.user_img,
            login: item.user_login,
            rate: item.rate,
            date: this.getDate(item.time),
        };
    }

    findRate(id, creatorId) {
        let rate = 0;
        this.ordersMap.get(id).responses.forEach((item) => {
            if (item.creatorId === creatorId) {
                rate = item.rate;
            }
        });
        return rate;
    }

    deleteResponse(id, creatorId) {
        let pos;
        this.ordersMap.get(id).responses.forEach((item, index) => {
            if (item.creatorId === creatorId) {
                pos = index;
            }
        });

        this.ordersMap.get(id).responses.splice(pos, 1);
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
                selectExecutor: res.executor_id?res.executor_id:null,
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
        if (month < 10) {
            month = `0${month + 1}`;
        }
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    getSelectResponse(order, id) {
        if (!id || !order) {
            return null;
        }

        let select = null;
        this.ordersMap.get(order).responses.forEach((item) => {
            if (item.creatorId === id) {
                select = item;
            }
        });

        return select;
    }
}

export default new Order();
