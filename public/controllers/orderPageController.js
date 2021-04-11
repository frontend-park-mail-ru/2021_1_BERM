import {Controller} from './controller.js';
import {OrderPageView} from '../views/orderPageView.js';

import auth from '../models/Auth.js';
import order from '../models/Order.js';
import user from '../models/User.js';
import {
    ORDER_PAGE_GET_RES,
    ORDER_PAGE_RES,
    ORDER_PAGE_RENDER,
    ORDER_SET_RATE,
    ORDER_GET_RATE,
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';

export class OrderPageController extends Controller {
    constructor() {
        super();
        this.view = new OrderPageView();
    }

    run() {
        super.run(
            [
                [ORDER_PAGE_GET_RES, this._orderPageGetRes],
                [ORDER_PAGE_RES, this._orderPageSetResponses],
                [ORDER_SET_RATE, this._orderSetRate],
                [ORDER_GET_RATE, this._orderGetRate],
            ],
            true);
    }

    _orderPageGetRes() {
        auth.getResponsesOrder(order.currentOrderId);
    }

    _orderPageSetResponses(res) {
        if (res.ok) {
            res.json().then((res) => {
                order.setResponses(order.currentOrderId, res);

                const creator = order.getOrderById(order.currentOrderId);

                eventBus.emit(ORDER_PAGE_RENDER, {
                    isAuthorized: user.isAuthorized,
                    isExecutor: true,
                    responses: creator.responses,
                    creator: {
                        avatar: creator.avatar,
                        title: creator.name,
                        category: creator.category,
                        definition: creator.definition,
                        date: creator.date,
                        budget: creator.budget,
                    },
                    minResponse: creator.minResponse,
                    userRate: order.findRate(order.currentOrderId, user.id),
                });
            });
        } else {
            console.log('Запрос /order/id/responses - не сработал');
            // ToDo Обработка ошибки запроса
        }
    }

    _orderSetRate({rate}) {
        auth.setResponse({
            user_id: user.id,
            rate: rate,
            time: Date.now() / 100,
        }, order.currentOrderId);
    }

    _orderGetRate(res) {
        if (res.ok) {
            res.json().then((res) => {
                order.pushResponse(res);

                const creator = order.getOrderById(order.currentOrderId);

                eventBus.emit(ORDER_PAGE_RENDER, {
                    isAuthorized: user.isAuthorized,
                    isExecutor: true,
                    responses: creator.responses,
                    creator: {
                        avatar: creator.avatar,
                        title: creator.name,
                        category: creator.category,
                        definition: creator.definition,
                        date: creator.date,
                        budget: creator.budget,
                    },
                    minResponse: creator.minResponse,
                    userRate: order.findRate(order.currentOrderId, user.id),
                });
            });
        } else {
            console.log('Запрос не сработал');
            // ToDo Обработка ошибки запроса
        }
    }
}
