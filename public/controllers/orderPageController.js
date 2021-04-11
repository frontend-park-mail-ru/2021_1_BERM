import {Controller} from './controller.js';
import {OrderPageView} from '../views/orderPageView.js';

import auth from '../models/Auth.js';
import order from '../models/Order.js';
import user from '../models/User.js';
import {
    ORDER_PAGE_GET_RES,
    ORDER_PAGE_RES,
    ORDER_PAGE_RENDER,
    ORDER_DELETE_RATE,
    ORDER_SET_RATE,
    ORDER_GET_RATE,
    ORDER_CHANGE_RATE,
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
                [ORDER_DELETE_RATE, this._orderDeleteRate],
                [ORDER_CHANGE_RATE, this._orderChangeRate],
            ],
            true);
    }

    _orderPageGetRes() {
        auth.getResponsesOrder(order.currentOrderId);
    }

    _orderPageSetResponses(res) {
        const go = this.go;
        if (res.ok) {
            res.json().then((res) => {
                order.setResponses(order.currentOrderId, res);

                go();
            });
        } else {
            console.log('Запрос /order/id/responses - не сработал');
            // ToDo Обработка ошибки запроса
        }
    }

    _orderSetRate({rate}) {
        const date = new Date();
        auth.setResponse({
            user_id: user.id,
            rate: rate,
            time: date.getTime(),
        }, order.currentOrderId);
    }

    _orderGetRate(res) {
        const go = this.go;
        if (res.ok) {
            res.json().then((res) => {
                order.pushResponse(order.currentOrderId, res);

                go();
            });
        } else {
            console.log('Запрос не сработал');
            // ToDo Обработка ошибки запроса
        }
    }

    go() {
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
            minResponse: order.findMin(order.currentOrderId),
            userRate: order.findRate(order.currentOrderId, user.id),
        });
    }

    _orderDeleteRate() {
        order.deleteResponse(order.currentOrderId, user.id);

        auth.deleteRate(order.currentOrderId)
            .catch(() => {
                console.log('Ошибка удаления');
            });

        this.go();
    }

    _orderChangeRate() {
        order.deleteResponse(order.currentOrderId, user.id);

        const date = new Date();
        auth.changeResponse({
            user_id: user.id,
            rate: rate,
            time: date.getTime(),
        }, order.currentOrderId);
    }
}
