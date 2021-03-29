import {Controller} from './controller.js';
import {OrderView} from "../views/orderView.js";

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";


export class OrderController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new OrderView(),
            [
                ['order-create', this._orderCreate],
                ['order-submit', this._orderSubmit],
            ]);
    }

    _orderCreate(res) {
        if (res.status === 201) {
            router.go('main-page');
        } else {
            eventBus.emit('no-order');
        }
    }

    _orderSubmit(info) {
        auth.createOrder(info);
    }
}