import {Controller} from './controller.js';
import {OrdersView} from '@/views/ordersView';

import auth from '@/models/Auth.js';
import order from '@/models/Order.js';
import eventBus from '@/modules/eventBus.js';
import user from '@/models/User.js';

import {
    GO_TO_ORDER,
    SEND_SERVICES,
    SEND_RESULT_RENDER,
    ORDERS_RENDER,
    SERVER_ERROR,
    ORDERS_PAGE_SEARCH,
    ORDERS_SEND_FEEDBACK,
    SEND_DATE_PAGINATE,
    RENDER_PAGINATE,
    SEND_DATE_PAGINATE_TO_SERVER,
} from '@/modules/constants/actions.js';

import router from '@/modules/router.js';
import {getNotFoundPath, getOrderPath} from '@/modules/constants/goPath.js';
import {ARCHIVE} from '@/modules/constants/pageNames.js';

/** Контроллер страницы заказов */
export class OrdersController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrdersView();
    }

    /**
     * Запуск контроллера страницы заказов
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        if (id) {
            const path = '/' + window.location.pathname
                .slice(1);

            if (ARCHIVE.test(path)) {
                this.isArchive = true;
            }
            this.isMyOrders = Number(id);
            this.isI = this.isMyOrders === user.id;
        }

        if (!user.isExecutor && !this.isI) {
            router.go(getNotFoundPath);
        }
        super.run(
            [
                [GO_TO_ORDER, this._goToOrder.bind(this)],
                [SEND_SERVICES, this._sendServices.bind(this)],
                [SEND_RESULT_RENDER, this._sendResultsRender.bind(this)],
                [ORDERS_PAGE_SEARCH, this._search.bind(this)],
                [ORDERS_SEND_FEEDBACK, this._sendFeedback.bind(this)],
                [SEND_DATE_PAGINATE, this._sendDatePaginate.bind(this)],
                [SEND_DATE_PAGINATE_TO_SERVER, this._sendPaginateServer],
            ],
            true);
    }

    /**
     * Переход к конкретному заказу
     *
     * @param {number} id - id заказа
     */
    _goToOrder(id) {
        router.go(getOrderPath(id));
    }

    /**
     * Получаем информацию о заказе, если ее нет
     */
    _sendServices() {
        if (this.isArchive) {
            auth.getArchiveOrders(this.isMyOrders);
            return;
        }

        if (this.isMyOrders) {
            auth.getMyOrders(this.isMyOrders);
            return;
        }

        auth.getOrders();
    }

    /**
     * Отправляем данные для рендеринга
     *
     * @param {Response} res - результат запроса
     */
    _sendResultsRender(res) {
        if (!res.ok) {
            eventBus.emit(ORDERS_RENDER, {
                isArchive: this.isArchive,
                isI: this.isI,
                isMyOrders: !!this.isMyOrders,
                isAuthorized: user.isAuthorized,
                isExecutor: user.isExecutor,
                map: new Map([]),
            });
            eventBus.emit(SERVER_ERROR, 'Не удалось получить заказы');
            return;
        }

        res.json().then((result) => {
            order.clear();
            order.setOrders(result);

            eventBus.emit(ORDERS_RENDER, {
                isArchive: this.isArchive,
                isI: this.isI,
                isMyOrders: !!this.isMyOrders,
                isAuthorized: user.isAuthorized,
                isExecutor: user.isExecutor,
                map: order.ordersMap,
            });
        });
    }

    /**
     * Ищем совпадения
     *
     * @param {Response} data - поиск
     */
    _search(data) {
        auth.searchOrders(data)
            .then((res) => {
                this._sendResultsRender(res);
            });
    }

    /**
     * Оставляем отзывы
     *
     * @param {Response} data - данные
     */
    _sendFeedback(data) {
        data.user = user.id;

        auth.sendFeedback(data)
            .then((res) => {
                if (!res.ok) {
                    eventBus.emit(SERVER_ERROR,
                        'Не удалось оставить отклик');
                }
            });
    }

    _sendDatePaginate(res) {
        if (res.ok) {
            res.json().then((result) => {
                order.clear();
                order.setOrders(result);

                eventBus.emit(RENDER_PAGINATE, {
                    isArchive: this.isArchive,
                    isI: this.isI,
                    isMyOrders: !!this.isMyOrders,
                    isAuthorized: user.isAuthorized,
                    isExecutor: user.isExecutor,
                    map: order.ordersMap,
                });
            });
        }
    }

    _sendPaginateServer(data) {
        debugger;
        auth.getToPaginateOrders(data);
    }
}
