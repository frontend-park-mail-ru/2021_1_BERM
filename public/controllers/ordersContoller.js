import {Controller} from './controller.js';
import {OrdersView} from '@/views/ordersView';

import auth from '../models/Auth.js';
import order from '../models/Order.js';
import eventBus from '@/modules/eventBus';
import user from '../models/User.js';

import {
    GO_TO_ORDER,
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
        if (id) {
            this.isMyOrders = Number(id);
            this.isI = this.isMyOrders === user.id;
        }

        super.run(
            [
                [GO_TO_ORDER, this._goToOrder.bind(this)],
                [SEND_SERVICES, this._sendServices.bind(this)],
                [SEND_RESULT_RENDER, this._sendResultsRender.bind(this)],
            ],
            true);
    }

    _goToOrder(id) {
        router.go(`/order/${id}`);
    }

    _sendServices() {
        if (this.isMyOrders) {
            auth.getMyOrders(this.isMyOrders);
        } else {
            auth.getOrders();
        }
    }

    _sendResultsRender(result) {
        if (result.ok) {
            result.json().then((result) => {
                order.setOrders(result);

                eventBus.emit(ORDERS_RENDER, {
                    isI: this.isI,
                    isMyOrders: !!this.isMyOrders,
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
