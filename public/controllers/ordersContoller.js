import {Controller} from './controller.js';
import {OrdersView} from '../views/ordersView.js';

import auth from '../models/Auth.js';
import order from '../models/Order.js';
import eventBus from '@/modules/eventBus';
import user from '../models/User.js';

import {
    GO_TO_ORDER,
    FLIP_THE_PAGE,
    SEND_SERVICES,
    SEND_RESULT_RENDER, ORDERS_RENDER,
} from '../modules/utils/actions.js';


export class OrdersController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrdersView();
    }

    run() {
        super.run(
            [
                [GO_TO_ORDER, this._goToOrder],
                [FLIP_THE_PAGE, this._flipThePage],
                [SEND_SERVICES, this._sendServices],
                [SEND_RESULT_RENDER, this._sendResultsRender],
            ],
        );
    }

    _goToOrder() {

    }

    _flipThePage() {

    }

    _sendServices() {
        auth.getOrders();
    }

    _sendResultsRender(result) {
        const res = [
            {
                id: 228, // id заказа
                category: 'Верстка',
                order_name: 'сверстать профиль',
                customer_id: 322, // id создателя
                budget: 1488,
                deadline: 1617004533, // unix-time
                description: 'Нужен профиль, чтобы в нем была вся необходимая информация, ничего не уезжало, и все было красиво и аккуратно',
                login: 'AlexDarkStalker',
                img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/',
            },
            {
                id: 322, // id заказа
                category: 'Программирование',
                order_name: 'сделать наконец нормальный апи',
                customer_id: 228, // id создателя
                budget: 3228,
                deadline: 1617004533, // unix-time
                description: 'Сделать нормальное апи для сайта поиска фрилансеров',
                login: 'AlexDarkStalker',
                img: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/',
            },
        ];
        order.setOrders(res);

        eventBus.emit(ORDERS_RENDER, {
            isAuthorized: user.isAuthorized,
            isExecutor: user.isExecutor,
            map: order.ordersMap,
        });
    }

    // if (res.ok) {
    //     res.json().then((res) => {
    //         order.setOrders(res);
    //         eventBus.emit(ORDERS_RENDER, order.ordersMap);
    //     });
    // }
}
