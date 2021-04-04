import {Controller} from './controller.js';
import {OrderView} from '../views/orderView.js';

import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import {
    NO_ORDER,
    ORDER_CREATE,
    ORDER_SUBMIT,
} from '../modules/utils/actions.js';
import {MAIN_PAGE} from '../modules/utils/pageNames.js';

/** Контроллер создания заказа */
export class OrderController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
    }

    /**
     * Запуск контроллера создания заказа
     */
    run() {
        super.run(
            new OrderView(),
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
            router.go(MAIN_PAGE); // ToDo: Переход на страницу заказа
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
