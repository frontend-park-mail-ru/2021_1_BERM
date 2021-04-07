import {Controller} from './controller.js';
import {OrderPageView} from '../views/orderPageView.js';

import auth from '../models/Auth.js';
import order from '../models/Order.js';
import {
    ORDER_PAGE_GET_RES,
    ORDER_PAGE_RES,
    ORDER_PAGE_RENDER,
} from '../modules/utils/actions.js';

export class OrderPageController extends Controller {
    constructor() {
        super();
        this.view = new OrderPageView();
    }

    run() {
        super.run(
            [
                [ORDER_PAGE_GET_RES, this._orderPageGetRes],
                [ORDER_PAGE_RES, this._orderPageRes],
            ],
        );
    }

    _orderPageGetRes() {
        auth.getResponsesOrder(order.currentOrderId);
    }

    _orderPageRes(res) {
        if (res.ok) {
            res.json().then((res) => {
                order.setResponses(order.currentOrderId, res);
                emit(ORDER_PAGE_RENDER, {
                    // ToDo отправляем данные для отрисовки
                });
            });
        } else {
            // ToDo Обработка ошибки запроса
        }
    }
}
