import {View} from './view.js';
import eventBus from '@/modules/eventBus.js';
import {
    SEND_SERVICES,
    ORDERS_RENDER,
    GO_TO_ORDER,
    SERVER_ERROR, ORDERS_PAGE_SEARCH,
} from '@/modules/constants/actions';
import ordersTemplate from '@/components/pages/orders.pug';
import {notification} from '@/components/notification/notification';

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
            [SERVER_ERROR, this._error],
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
                isArchive: dataForRender.isArchive,
            }),
        );

        if (!dataForRender.isMyOrders && !dataForRender.isArchive) {
            const form = document.getElementById('search__form');
            form.addEventListener('submit', (event) => {
                event.preventDefault();

                const data = {
                    keyword: event.target.search.value,
                };

                eventBus.emit(ORDERS_PAGE_SEARCH, data);
            });
        }

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

    _error(str) {
        notification(`Ошибка сервера! ${str}`);
    }
}
