import {View} from './view.js';
import {
    ORDER_PAGE_RENDER,
    ORDER_PAGE_GET_RES,
    ORDER_SET_RATE,
    ORDER_DELETE_RATE,
    ORDER_CHANGE_RATE,
    ORDER_SET_EXECUTOR,
    ORDER_DELETE_EXECUTOR,
    ORDER_PAGE_DELETE,
    ORDER_PAGE_ERROR,
    ORDER_PAGE_FEEDBACK,
    ORDER_PAGE_SEND_FEEDBACK,
    CHANGE_ORDER,
} from '@/modules/constants/actions.js';
import eventBus from '@/modules/eventBus.js';
import orderPageTemplate from '@/components/pages/order/orderPage.pug';
import feedback from '@/components/modelWindows/feedback.pug';
import {Validator} from './validation/validator';
import {notification} from '@/components/notification/notification.js';
import createOrderOrVacancy
    from '@/components/pages/createOrderVacancy/createOrderOrVacancy.pug';
import Select from '@/modules/utils/customSelect';
import {listOfServices} from '@/modules/utils/templatesForSelect';
import PriceHandler from '@/modules/utils/priceHandler';
import {confim} from '@/components/modelWindows/confim/confim';
import DateHandler from '@/modules/utils/dateHandler';

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
            [ORDER_PAGE_RENDER, this._orderPageRender.bind(this)],
            [ORDER_PAGE_ERROR, this._error.bind(this)],
            [ORDER_PAGE_FEEDBACK, this._feedback.bind(this)],
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
            const prHandler = new PriceHandler('rate');
            prHandler.start();

            const form = document
                .getElementsByClassName('orderPage__set-rate_form')[0];
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
            return;
        }

        const changeButton = document.
            querySelector('.vacancyPage__customer-button_change');

        changeButton.addEventListener('click', (e) => {
            e.preventDefault();
            this._changeOrderRender(dataForRender);
        });

        if (dataForRender.selectExecutor) {
            const endBtn = document
                .querySelector('.orderPage__order_end');

            endBtn.addEventListener('click', (() => {
                confim(
                    (event) => {
                        event.preventDefault();
                        const elem = document
                            .getElementById('confim_window');
                        elem.parentNode.removeChild(elem);
                        this._feedback();
                    });
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
                confim(
                    (event) => {
                        event.preventDefault();
                        eventBus.emit(ORDER_PAGE_DELETE);
                    });
            }));

            const selectButtons = document
                .querySelectorAll('.orderPage__response_btn');

            selectButtons.forEach((item) => {
                item.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');

                    eventBus.emit(ORDER_SET_EXECUTOR, Number(id));
                });
            });
        }
    }


    /**
     * Обработка ошибки
     *
     * @param {string} error - текст ошибки
     */
    _error(error) {
        notification(`Ошибка сервера. ${error}`);
    }

    /**
     * Всплывающее окно отзыва
     */
    _feedback() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('scroll_hidden');

        const root = document.getElementById('root');
        root.insertAdjacentHTML('beforeend', feedback());

        const skip = document.querySelector('.orderPage__feedback_skip');
        skip.addEventListener('click', (event) => {
            event.preventDefault();

            body.classList.remove('scroll_hidden');
            eventBus.emit(ORDER_PAGE_SEND_FEEDBACK, {skip: true});
        });

        const form = document.getElementById('specForm');
        const validator = new Validator(
            'specForm',
            '.form-control',
            'send_mess',
        );
        validator.validate();
        form.addEventListener('submit', (event) => {
            body.classList.remove('scroll_hidden');
            event.preventDefault();

            const data = {
                score: 6 - Number(event.target.rating.value),
                text: event.target.description.value,
            };

            if (data.score === 6) {
                data.score = 1;
            }

            eventBus.emit(ORDER_PAGE_SEND_FEEDBACK, data);
        });
    }

    /**
     * Отображение страницы
     *
     * @param {Object} info - исходная информация для отрисовски
     */
    _changeOrderRender(info) {
        const form = document.querySelector(' .orderPage');
        const isChange = true;
        const chInfo = {
            isOrder: true,
            isChange: isChange,
            creator: info.creator,
        };

        form.innerHTML = createOrderOrVacancy(chInfo);
        new Select(
            '#select', {
                placeholder: 'Категория',
                data: listOfServices,
            }, 'dynamic-style');
        const category = document.querySelector('[data-type="value"]');
        const selectInput = document.querySelector('.select__input');
        category.value = info.creator.category;
        const scrollHeight = category.scrollHeight;
        category.style.height = scrollHeight - 4 + 'px';
        selectInput.style.height = scrollHeight + 2 + 'px';
        // category.style.width = category.scrollWidth + 'px';
        const val = new Validator(
            'order-create_form',
            '.form-control',
            'send_mess',
        );
        val.validate();
        const date = new DateHandler();
        date.createDate();

        const cancelButton = document.
            querySelector('.change-form__cancel');
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            eventBus.emit(ORDER_PAGE_GET_RES);
        });

        const changeForm = document.
            getElementById('order-create_form');

        changeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sendInfo = {
                category: e.target.category.value,
                description: e.target.description.value,
            };
            sendInfo.budget = Number(e.target.budget.value);
            sendInfo.order_name = e.target.order_name.value;
            const date = e.target.date.value.split('.');
            sendInfo.deadline =
                new Date(date[2], date[1] - 1, date[0]).getTime();
            eventBus.emit(CHANGE_ORDER, sendInfo);
        });
    }
}
