import {View} from './view.js';
import {Validator} from './validator.js';
import eventBus from '../modules/eventBus.js';
import {NO_ORDER, ORDER_SUBMIT} from '../modules/utils/actions.js';

import createOrderTemplate from '@/components/pages/createOrder.pug';
import DateHandler from '../modules/utils/dateHandler.js';
import Select from '../modules/utils/customSelect.js';
import {listOfServices} from '../modules/utils/templatesForSelect.js';

/** View создания заказа */
export class OrderCreateView extends View {
    /**
     * Отображение страницы и получение с нее данных
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.renderHtml(
            isAuthorized,
            isExecutor,
            'Разместить заказ',
            createOrderTemplate(),
            [
                [NO_ORDER, this._onNoOrder],
            ]);

        const date = new DateHandler();
        date.createDate();
        new Select(
            '#select', {
                placeholder: 'Категория',
                data: listOfServices,
            }, 'dynamic-style');


        // const val = new Validator( Todo СДЕЛАТЬ
        //     'order-create_form',
        //     '.form-control',
        //     'send_mess',
        // );
        // val.validate();

        const form = document.getElementById('order-create_form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const date = event.target.date.value.split('.');
            const data = {
                order_name: event.target.order_name.value,
                category: event.target.category.value,
                description: event.target.description.value,
                budget: Number(event.target.budget.value),
                deadline: new Date(date[2], date[1], date[0]).getTime() / 1000,
            };

            eventBus.emit(ORDER_SUBMIT, data);
        });
    }

    /**
     * Обработка в случае провала
     */
    _onNoOrder() {
        // ToDo не удалось разместить заказ
        console.log('ToDo не удалось разместить заказ');
    }
}

