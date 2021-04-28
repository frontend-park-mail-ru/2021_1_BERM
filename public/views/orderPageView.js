import {View} from './view.js';
import {
    ORDER_PAGE_RENDER,
    ORDER_PAGE_GET_RES,
    ORDER_SET_RATE,
    ORDER_DELETE_RATE,
    ORDER_CHANGE_RATE,
    ORDER_SET_EXECUTOR,
    ORDER_ERROR_SET,
    ORDER_DELETE_EXECUTOR,
    ORDER_ERROR_DELETE_EX,
} from '@/modules/utils/actions.js';
import eventBus from '@/modules/eventBus.js';
import orderPageTemplate from '@/components/pages/orderPage.pug';
import {Validator} from './validator';
import {notification} from '@/components/notification/notification.js';

/** View страницы заказа */
export class OrderPageView extends View {
    /**
     * Установка обработчиков
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [ORDER_PAGE_RENDER, this._orderPageRender],
            [ORDER_ERROR_SET, this._errorSet],
            [ORDER_ERROR_DELETE_EX, this._errorDeleteEx],
        ]);

        eventBus.emit(ORDER_PAGE_GET_RES);
    }

    /**
     * Отображение страницы
     *
     * @param {Object} dataForRender
     */
    _orderPageRender(dataForRender) {
        super.renderHtml(
            dataForRender.isAuthorized,
            dataForRender.isExecutor,
            'Страница заказа',
            orderPageTemplate(dataForRender),
        );

        if (dataForRender.isExecutor) {
            const val = new Validator(
                'rate-form',
                '.form-control',
                'send_mess',
            );
            val.validate();

            const form = document
                .getElementsByClassName('orderPage__set-rate_form')[0];
            if (dataForRender.isExecutor) {
                if (dataForRender.userRate === 0) {
                    form.addEventListener('submit', (event) => {
                        event.preventDefault();
                        const data = {
                            rate: Number(event.target.rate.value),
                        };

                        eventBus.emit(ORDER_SET_RATE, data);
                    });
                } else {
                    const deleteButton = document
                        .querySelector('.orderPage__set-rate_button-del');

                    deleteButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        eventBus.emit(ORDER_DELETE_RATE);
                    });

                    form.addEventListener('submit', (event) => {
                        event.preventDefault();
                        const data = {
                            rate: Number(event.target.rate.value),
                        };

                        eventBus.emit(ORDER_CHANGE_RATE, data);
                    });
                }
            }
        } else {
            if (dataForRender.selectExecutor) {
                const endBtn = document
                    .querySelector('.orderPage__order_end');

                endBtn.addEventListener('click', (() => {
                    // ToDo: Запрос на завершение заказа
                }));

                const deleteButton = document
                    .querySelector('.orderPage__set-rate_button-exit');

                deleteButton.addEventListener('click', () => {
                    eventBus.emit(ORDER_DELETE_EXECUTOR);
                });
            } else {
                const deleteBtn = document
                    .querySelector('.orderPage__order_delete');

                deleteBtn.addEventListener('click', (() => {
                    // ToDo: Запрос на удаление в контроллер.
                }));

                const selectButtons = document
                    .querySelectorAll('.orderPage__response_btn');

                selectButtons.forEach((item) => {
                    item.addEventListener('click', (event) => {
                        const id = event.target.getAttribute('data-id');
                        debugger;

                        eventBus.emit(ORDER_SET_EXECUTOR, Number(id));
                    });
                });
            }
        }
    }

    /**
     * Обработка в случае неудачной установке исполнителя
     */
    _errorSet() {
        notification('Ошибка сервера. Исполнитель не выбран');
    }

    /**
     * Обработка в случае неудачной отмене исполнителя
     */
    _errorDeleteEx() {
        notification('Ошибка сервера. Исполнитель не отменен');
    }
}
