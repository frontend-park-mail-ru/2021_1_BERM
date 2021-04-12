import {Controller} from './controller.js';
import {OrderOrVacancyCreateView} from '../views/orderOrVacancyCreateView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import order from '../models/Order.js';
import {
    NO_ORDER,
    ORDER_CREATE,
    ORDER_SUBMIT,
    GET_IS_ORDER_OR_VACANCY,
    ORDER_CREATE_GO_RENDER,
} from '../modules/utils/actions.js';

/** Контроллер создания заказа */
export class OrderCreateController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrderOrVacancyCreateView();
    }

    /**
     * Запуск контроллера создания заказа
     */
    run(id) {
        super.run(
            [
                [ORDER_CREATE, this._orderCreate],
                [ORDER_SUBMIT, this._orderSubmit],
                [GET_IS_ORDER_OR_VACANCY, this._orderOrVacancy],
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

    _orderOrVacancy() {
        eventBus.emit(ORDER_CREATE_GO_RENDER, {isOrder: true});
    }
}
