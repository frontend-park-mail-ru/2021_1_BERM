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
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';

import orderPageTemplate from '@/components/pages/orderPage.pug';
import {Validator} from './validator';

export class OrderPageView extends View {
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [ORDER_PAGE_RENDER, this._orderPageRender],
            [ORDER_ERROR_SET, this._errorSet],
            [ORDER_ERROR_DELETE_EX, this._errorDeleteEx],
        ]);

        eventBus.emit(ORDER_PAGE_GET_RES);
    }

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
                const deleteButton = document
                    .querySelector('.orderPage__set-rate_button-exit');

                deleteButton.addEventListener('click', () => {
                    eventBus.emit(ORDER_DELETE_EXECUTOR);
                });
            } else {
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

    _errorSet() {
        // ToDo: Ошибка сервера. Исполнитель не выбран
        console.log('Ошибка сервера. Исполнитель не выбран');
    }

    _errorDeleteEx() {
        // ToDo: Ошибка сервера. Исполнитель не отменен
        console.log('Ошибка сервера. Исполнитель не отменен');
    }
}
