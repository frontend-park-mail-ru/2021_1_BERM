import {Controller} from './controller.js';
import {OrderCreateView} from '../views/orderCreateView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import order from '../models/Order.js';
import {
    NO_ORDER,
    ORDER_CREATE,
    ORDER_SUBMIT,
} from '../modules/utils/actions.js';

/** Контроллер создания заказа */
export class OrderCreateController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrderCreateView();
    }

    /**
     * Запуск контроллера создания заказа
     */
    run(id) {
        super.run(
            [
                [ORDER_CREATE, this._orderCreate],
                [ORDER_SUBMIT, this._orderSubmit],
            ],
            true);
    }

    /**
     * Обработка результата
     *
     * @param {Response} res - результат запроса
     */
    _orderCreate(res) {
        if (res.ok) {
            res.json()
                .then((res) => {
                    order.setOrders([res]);

                    router.go(`/order/${order.currentOrderId}`);
                });
        } else {
            eventBus.emit(NO_ORDER);
        }
    }

    /**
     * Отправка результата
     *
     * @param {Object} info - данные на отправку
     */
    _orderSubmit(info) {
        auth.createOrder(info);
    }
}