import {Controller} from './controller.js';
import {OrdersView} from '../views/ordersView.js';

import auth from '../models/Auth.js';
import order from '../models/Order.js';
import eventBus from '@/modules/eventBus';
import user from '../models/User.js';

import {
    GO_TO_ORDER,
    FLIP_THE_PAGE,
    SEND_SERVICES,
    SEND_RESULT_RENDER,
    ORDERS_RENDER,
} from '../modules/utils/actions.js';

import router from '@/modules/router';


export class OrdersController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrdersView();
    }

    run(id) {
        super.run(
            [
                [GO_TO_ORDER, this._goToOrder],
                [FLIP_THE_PAGE, this._flipThePage],
                [SEND_SERVICES, this._sendServices],
                [SEND_RESULT_RENDER, this._sendResultsRender],
            ],
            true);
    }

    _goToOrder(id) {
        router.go(`/order/${id}`);
    }

    _flipThePage() {

    }

    _sendServices() {
        auth.getOrders();
    }

    _sendResultsRender(result) {
        if (result.ok) {
            result.json().then((result) => {
                order.setOrders(result);

                eventBus.emit(ORDERS_RENDER, {
                    isAuthorized: user.isAuthorized,
                    isExecutor: user.isExecutor,
                    map: order.ordersMap,
                });
            });
        }
    }

    // if (res.ok) {
    //     res.json().then((res) => {
    //         order.setOrders(res);
    //         eventBus.emit(ORDERS_RENDER, order.ordersMap);
    //     });
    // }
}
