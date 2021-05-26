import {View} from './view.js';
import eventBus from '@/modules/eventBus.js';
import {
    SEND_SERVICES,
    ORDERS_RENDER,
    GO_TO_ORDER,
    SERVER_ERROR,
    ORDERS_PAGE_SEARCH,
    ORDERS_SEND_FEEDBACK, GO_TO_VACANCY,
} from '@/modules/constants/actions';
import ordersTemplate from '@/components/pages/orders/orders.pug';
import {notification} from '@/components/notification/notification';
import feedback from '@/components/modelWindows/feedback.pug';
import {Validator} from '@/views/validation/validator';

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
            [ORDERS_RENDER, this._renderData.bind(this)],
            [SERVER_ERROR, this._error.bind(this)],
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

        const archiveMap = [];
        if (dataForRender.mapVacancies) {
            for (const item of dataForRender.mapVacancies.values()) {
                archiveMap.push(item);
            }
        }

        map.forEach((item) => {
            item.budget += '₽';
        });
        archiveMap.forEach((item) => {
            item.budget += '₽';
        });

        super.renderHtml(
            dataForRender.isAuthorized,
            dataForRender.isExecutor,
            'Все заказы',
            ordersTemplate({
                orders: map,
                archiveVacancies: archiveMap,
                isI: dataForRender.isI,
                isMyOrders: dataForRender.isMyOrders,
                isArchive: dataForRender.isArchive,
                isExecutor: dataForRender.isExecutor,
            }),
        );

        if (dataForRender.isArchive) {
            const feedback = document
                .querySelectorAll('.orders__feedback');
            feedback.forEach((e) => {
                e.addEventListener('click', (event) => {
                    event.preventDefault();

                    const to = Number(
                        event.target.getAttribute('data-creator'));
                    const order = Number(
                        event.target.getAttribute('data-order'));

                    this._feedback(to, order);
                });
            });

            const allRef = document.querySelectorAll('.vacancies__order_link');
            allRef.forEach((ref) => {
                ref.addEventListener('click', (e) => {
                    e.preventDefault();
                    eventBus.emit(GO_TO_VACANCY, ref.getAttribute('name'));
                });
            });

            const allTit = document.querySelectorAll('.vacancies__order_title');
            allTit.forEach((tit) => {
                tit.addEventListener('click', () => {
                    eventBus.emit(GO_TO_VACANCY, tit.getAttribute('name'));
                });
            });
        }

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

    /**
     * Вывод ошибка
     *
     * @param {String} str
     */
    _error(str) {
        notification(`Ошибка сервера! ${str}`);
    }

    /**
     * Показ окна отзыва
     *
     * @param {number} to
     * @param {number} order
     */
    _feedback(to, order) {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('scroll_hidden');

        const root = document.getElementById('root');
        root.insertAdjacentHTML('beforeend', feedback());

        const elem = document.getElementById('confim_window');

        const skip = document.querySelector('.orderPage__feedback_skip');
        skip.addEventListener('click', (event) => {
            event.preventDefault();
            elem.parentNode.removeChild(elem);
            body.classList.remove('scroll_hidden');
        });

        const form = document.getElementById('specForm');
        const validator = new Validator(
            'specForm',
            '.form-control',
            'send_mess',
        );
        validator.validate();
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const data = {
                score: 6 - Number(event.target.rating.value),
                text: event.target.description.value,
                to_user: to,
                order_id: order,
            };

            if (data.score === 6) {
                data.score = 1;
            }

            elem.parentNode.removeChild(elem);
            body.classList.remove('scroll_hidden');
            eventBus.emit(ORDERS_SEND_FEEDBACK, data);
        });
    }
}
