import {View} from './view.js';
import {
    ORDER_PAGE_RENDER,
    ORDER_PAGE_GET_RES,
    ORDER_SET_RATE,
    ORDER_DELETE_RATE,
    ORDER_CHANGE_RATE,
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';

import orderPageTemplate from '@/components/pages/orderPageExecutor.pug';

export class OrderPageView extends View {
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [ORDER_PAGE_RENDER, this._orderPageRender],
        ]);

        eventBus.emit(ORDER_PAGE_GET_RES);
    }

    _orderPageRender(info) {
        super.renderHtml(
            info.isAuthorized,
            info.isExecutor,
            'Страница заказа',
            orderPageTemplate(info),
        );

        if (info.isExecutor) {
            const form = document
                .getElementsByClassName('orderPage__set-rate_form')[0];
            if (info.userRate === 0) {
                form.addEventListener('submit', (event) => {
                    debugger;
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
    }
}
