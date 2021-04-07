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
import {ORDER_PAGE} from '../modules/utils/pageNames.js';

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
    run() {
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
                    order.setAttributes({
                        id: res.id,
                        name: res.order_name,
                        category: res.category,
                        description: res.description,
                        budget: res.budget,
                        deadline: res.deadline,
                        customerId: res.customer_id,
                    });

                    router.go(ORDER_PAGE);
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
