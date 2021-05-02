/** Класс для хранения заказов */
class Order {
    /**
     * Конструктор
     */
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

    /**
     * Устанавливаем один отклик
     *
     * @param {number} id - уникальный номер заказа
     * @param {Object} item - информация отклика
     */
    push(id, item) {
        this.ordersMap.get(id).responses.push(this.pushResponse(id, item));
    }

    /**
     * Устанавливаем отклики
     *
     * @param {number} id - уникальный номер заказа
     * @param {Response} res - все отклики
     */
    setResponses(id, res) {
        const responses = [];

        res.forEach((item) => {
            responses.push(this.pushResponse(id, item));
        });

        this.ordersMap.get(id).responses = responses;
    }

    /**
     * Возвращаем структурированный отклик
     *
     * @param {number} id - уникальный номер заказа
     * @param {Object} item - информация отклика
     *
     * @return {Object}
     */
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

    /**
     * Ищем ставку по уникальным номерам
     *
     * @param {number} id - уникальный номер заказа
     * @param {Object} creatorId - уникальный номер автора отклика
     *
     * @return {Object} rate - найденную ставку
     */
    findRate(id, creatorId) {
        let rate = 0;
        this.ordersMap.get(id).responses.forEach((item) => {
            if (item.creatorId === creatorId) {
                rate = item.rate;
            }
        });
        return rate;
    }

    /**
     * Удаляем ставку
     *
     * @param {number} id - уникальный номер заказа
     * @param {Object} creatorId - уникальный номер автора отклика
     */
    deleteResponse(id, creatorId) {
        let pos = 0;
        this.ordersMap.get(id).responses.forEach((item, index) => {
            if (item.creatorId === creatorId) {
                pos = index;
            }
        });

        this.ordersMap.get(id).responses.splice(pos, 1);
    }

    /**
     * Устанавливаем заказы
     *
     * @param {Object} data - массив заказов
     */
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

    /**
     * Получаем информацию о заказе
     *
     * @param {number} id - уникальный номер заказа
     *
     * @return {Object} - информация о заказе
     */
    getOrderById(id) {
        return this.ordersMap.get(id);
    }

    /**
     * Поиск минимальной ставки
     *
     * @param {number} id - уникальный номер заказа
     *
     * @return {number} min - минимальная ставка
     */
    findMin(id) {
        let min = {rate: -1};

        this.ordersMap.get(id).responses.forEach((item) => {
            if (min.rate === -1 || item.rate < min.rate) {
                min = item;
            }
        });

        return min;
    }

    /**
     * Перевод unix time в формат ДД.ММ.ГГГГ
     *
     * @param {number} time - unix time
     *
     * @return {string} data
     */
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

    /**
     * Ищем отклик
     *
     * @param {Object} order - уникальный номер заказа
     * @param {number} id - уникальный номер отклика
     *
     * @return {Object} select - информацию по отклику
     */
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

    /** Обнуляем заказы */
    clear() {
        this.currentOrderId = -1;
        this.ordersMap = new Map([]);
        this.getOrders = false;
    }
}

export default new Order();
