import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import {
    GET_ORDERS,
    SEND_SERVICES,
    SEND_RESULT_RENDER,
    ORDERS_RENDER, GO_TO_ORDER,
} from '@/modules/utils/actions';
import ordersTemplate from '@/components/pages/orders.pug';

export class OrdersView extends View {
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [ORDERS_RENDER, this._renderData],
        ]);
        eventBus.emit(SEND_SERVICES);
    }

    _renderData(dataMap) {
        const map = [];
        for (const item of dataMap.map.values()) {
            map.push(item);
        }

        super.renderHtml(
            dataMap.isAuthorized,
            dataMap.isExecutor,
            'Все заказы',
            ordersTemplate({
                orders: map,
                isI: dataMap.isI,
                isMyOrders: dataMap.isMyOrders,
            }),
        );

        // const allId = document.querySelectorAll('#id');
        const allRef = document.querySelectorAll('.orders__order_link');
        allRef.forEach((ref) => {
            ref.addEventListener('click', (e) => {
                e.preventDefault();
                eventBus.emit(GO_TO_ORDER, ref.getAttribute('name'));
            });
        });

        const allTit = document.querySelectorAll('.orders__order_title');
        allTit.forEach((tit) => {
            tit.addEventListener('click', (e) => {
                eventBus.emit(GO_TO_ORDER, tit.getAttribute('name'));
            });
        });
    }
}
