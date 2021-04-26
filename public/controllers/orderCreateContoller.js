import {Controller} from './controller.js';
import {OrderOrVacancyCreateView} from '@/views/orderOrVacancyCreateView';
import {getOrderPath} from '@/modules/utils/goPath.js';
import eventBus from '@/modules/eventBus.js';
import router from '@/modules/router.js';
import auth from '@/models/Auth.js';
import order from '@/models/Order.js';
import {
    NO_ORDER,
    ORDER_CREATE_GET,
    ORDER_CREATE_SUBMIT,
    ORDER_CREATE_OR_VACANCY,
    ORDER_CREATE_GO_RENDER,
} from '@/modules/utils/actions';

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
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        super.run(
            [
                [ORDER_CREATE_GET, this._orderCreate],
                [ORDER_CREATE_SUBMIT, this._orderSubmit],
                [ORDER_CREATE_OR_VACANCY, this._orderOrVacancy],
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

                    router.go(getOrderPath(order.currentOrderId));
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

    /**
     * Метод необходимый для передачи параметра,
     * определяющего отрисовку или заказа, или вакансии
     */
    _orderOrVacancy() {
        eventBus.emit(ORDER_CREATE_GO_RENDER, {isOrder: true});
    }
}
