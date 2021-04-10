import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import {
    GET_ORDERS,
    SEND_SERVICES,
    SEND_RESULT_RENDER,
    ORDERS_RENDER,
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
            }),
        );
    }
}
