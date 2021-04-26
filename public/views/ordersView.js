import {View} from './view.js';
import eventBus from '@/modules/eventBus.js';
import {
    SEND_SERVICES,
    ORDERS_RENDER,
    GO_TO_ORDER,
} from '@/modules/utils/actions';
import ordersTemplate from '@/components/pages/orders.pug';

/** View страницы всех заказов */
export class OrdersView extends View {
    /**
     * Установка обработчиков
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [ORDERS_RENDER, this._renderData],
        ]);
        eventBus.emit(SEND_SERVICES);
    }

    /**
     * Отображение страницы
     *
     * @param {Object} dataForRender
     */
    _renderData(dataForRender) {
        const map = [];
        for (const item of dataForRender.map.values()) {
            map.push(item);
        }

        super.renderHtml(
            dataForRender.isAuthorized,
            dataForRender.isExecutor,
            'Все заказы',
            ordersTemplate({
                orders: map,
                isI: dataForRender.isI,
                isMyOrders: dataForRender.isMyOrders,
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
            tit.addEventListener('click', () => {
                eventBus.emit(GO_TO_ORDER, tit.getAttribute('name'));
            });
        });
    }
}
