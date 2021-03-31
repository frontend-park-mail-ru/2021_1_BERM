import {Controller} from './controller.js';
import {OrderView} from "../views/orderView.js";

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";
import {NO_ORDER, ORDER_CREATE, ORDER_SUBMIT} from "../modules/utils/actions.js";


export class OrderController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new OrderView(),
            [
                [ORDER_CREATE, this._orderCreate],
                [ORDER_SUBMIT, this._orderSubmit],
            ]);
    }

    _orderCreate(res) {
        if (res.ok) {
            router.go('main-page');
        } else {
            eventBus.emit(NO_ORDER);
        }
    }

    _orderSubmit(info) {
        auth.createOrder(info);
    }
}