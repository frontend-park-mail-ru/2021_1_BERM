import {Controller} from './controller.js';
import {OrdersView} from '../views/ordersView.js';

import auth from '../models/Auth.js';
import order from '../models/Order.js';

import {
    GO_TO_ORDER,
    FLIP_THE_PAGE,
    SEND_SERVICES,
    SEND_RESULT_RENDER, ORDERS_RENDER,
} from '../modules/utils/actions.js';
import eventBus from "@/modules/eventBus";


export class OrdersController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrdersView();
    }

    run() {
        super.run(
            [
                [GO_TO_ORDER, this._goToOrder],
                [FLIP_THE_PAGE, this._flipThePage],
                [SEND_SERVICES, this._sendServices],
                [SEND_RESULT_RENDER, this._sendResultsRender],
            ]
        )
    }

    _goToOrder() {

    }

    _flipThePage() {

    }

    _sendServices() {
        auth.getResponsesOrders();
    }

    _sendResultsRender(res) {
        if (res.ok) {
            res.json().then((res) => {
                order.orders = res;
            })
            eventBus.emit(ORDERS_RENDER);
        }

    }

}