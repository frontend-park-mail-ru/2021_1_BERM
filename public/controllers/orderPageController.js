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
    ORDER_GET,
    ORDER_CHANGE_RATE,
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';

export class OrderPageController extends Controller {
    constructor() {
        super();
        this.view = new OrderPageView();
    }

    run(id) {
        order.currentOrderId = Number(id);

        super.run(
            [
                [ORDER_PAGE_GET_RES, this._orderPageGetRes.bind(this)],
                [ORDER_PAGE_RES, this._orderPageSetResponses.bind(this)],
                [ORDER_SET_RATE, this._orderSetRate.bind(this)],
                [ORDER_GET_RATE, this._orderGetRate.bind(this)],
                [ORDER_DELETE_RATE, this._orderDeleteRate.bind(this)],
                [ORDER_CHANGE_RATE, this._orderChangeRate.bind(this)],
                [ORDER_GET, this._orderGet.bind(this)],
            ],
            true);
    }

    _orderPageGetRes() {
        if (order.getOrderById(order.currentOrderId)) {
            auth.getResponsesOrder(order.currentOrderId);
        } else {
            auth.getOrder(order.currentOrderId);
        }
    }

    _orderGet(res) {
        if (res.ok) {
            res.json().then((res) => {
                order.setOrders([res]);
                auth.getResponsesOrder(order.currentOrderId);
            });
        } else {
            console.log('Запрос /order/id - не сработал');
            // ToDo Обработка ошибки запроса
        }
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
                order.setResponses(order.currentOrderId, [res]);

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
            isExecutor: user.isExecutor,
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

    _orderChangeRate({rate}) {
        order.deleteResponse(order.currentOrderId, user.id);

        const date = new Date();
        auth.changeResponse({
            user_id: user.id,
            rate: rate,
            time: date.getTime(),
        }, order.currentOrderId);
    }
}
