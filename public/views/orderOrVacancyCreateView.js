import {View} from './view.js';
import {Validator} from './validation/validator.js';
import eventBus from '@/modules/eventBus.js';
import {
    NO_ORDER,
    ORDER_CREATE_SUBMIT,
    ORDER_CREATE_GO_RENDER,
    ORDER_CREATE_OR_VACANCY,
    VACANCY_SUBMIT,
} from '@/modules/constants/actions.js';

import createOrderTemplate from '@/components/pages/createOrderOrVacancy.pug';
import DateHandler from '@/modules/utils/dateHandler.js';
import Select from '@/modules/utils/customSelect.js';
import {listOfServices} from '@/modules/utils/templatesForSelect.js';
import {notification} from '@/components/notification/notification.js';
import PriceHandler from '@/modules/utils/priceHandler';

/** View создания заказа */
export class OrderOrVacancyCreateView extends View {
    /**
     * Установка обработчиков
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        this.isAuthorized = isAuthorized;
        this.isExecutor = isExecutor;

        super.setListeners([
            [ORDER_CREATE_GO_RENDER, this._renderWithData.bind(this)],
            [NO_ORDER, this._onNoOrder.bind(this)],
        ]);

        eventBus.emit(ORDER_CREATE_OR_VACANCY);
    }

    /**
     * Отображение страницы
     *
     * @param {Object} data
     */
    _renderWithData(data) {
        super.renderHtml(
            this.isAuthorized,
            this.isExecutor,
            'Разместить заказ',
            createOrderTemplate({
                isOrder: data.isOrder,
            }));

        const nameField = 'budget';

        if (data.isOrder) {
            const date = new DateHandler();
            date.createDate();
        }
        new Select(
            '#select', {
                placeholder: 'Категория',
                data: listOfServices,
            }, 'dynamic-style');


        const val = new Validator(
            'order-create_form',
            '.form-control',
            'send_mess',
        );
        val.validate();

        const prHandler = new PriceHandler(nameField);
        prHandler.start();

        const form = document.getElementById('order-create_form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const info = {
                category: event.target.category.value,
                description: event.target.description.value,
            };

            if (data.isOrder) {
                info.budget = Number(event.target.budget.value);
                const date = event.target.date.value.split('.');
                info.order_name = event.target.order_name.value;
                info.deadline =
                    new Date(date[2], date[1] - 1, date[0]).getTime();
                eventBus.emit(ORDER_CREATE_SUBMIT, info);
            } else {
                info.salary = Number(event.target.budget.value);
                info.vacancy_name = event.target.order_name.value;
                eventBus.emit(VACANCY_SUBMIT, info);
            }
        });
    }

    /**
     * Обработка в случае провала
     */
    _onNoOrder() {
        notification('Ошибка сервера. Не удалось разместить заказ');
    }
}

