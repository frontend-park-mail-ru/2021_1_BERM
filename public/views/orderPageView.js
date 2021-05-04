import {View} from './view.js';
import {
    ORDER_PAGE_RENDER,
    ORDER_PAGE_GET_RES,
    ORDER_SET_RATE,
    ORDER_DELETE_RATE,
    ORDER_CHANGE_RATE,
    ORDER_SET_EXECUTOR,
    ORDER_DELETE_EXECUTOR,
    ORDER_PAGE_END,
    ORDER_PAGE_DELETE,
    ORDER_PAGE_ERROR,
    ORDER_PAGE_FEEDBACK,
    ORDER_PAGE_SEND_FEEDBACK,
    CHANGE_ORDER,
} from '@/modules/constants/actions.js';
import eventBus from '@/modules/eventBus.js';
import orderPageTemplate from '@/components/pages/orderPage.pug';
import feedback from '@/components/modelWindows/feedback.pug';
import {Validator} from './validation/validator';
import {notification} from '@/components/notification/notification.js';
import createOrderOrVacancy from '@/components/pages/createOrderOrVacancy.pug';
import Select from '@/modules/utils/customSelect';
import {listOfServices} from '@/modules/utils/templatesForSelect';
import {confim} from '@/components/modelWindows/confim/confim';

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
                        eventBus.emit(ORDER_PAGE_END);
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
        form.addEventListener('submit', (event) => {
            body.classList.remove('scroll_hidden');
            event.preventDefault();

            const data = {
                score: 6 - Number(event.target.rating.value),
                text: event.target.description.value,
            };

            eventBus.emit(ORDER_PAGE_SEND_FEEDBACK, data);
        });
    }

    _changeOrderRender(info) {
        const form = document.querySelector(' .orderPage');
        const isChange = true;
        console.log(info.creator);
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
        category.value = info.creator.category;
        category.style.width = category.scrollWidth + 'px';
        const val = new Validator(
            'order-create_form',
            '.form-control',
            'send_mess',
        );
        val.validate();

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
            sendInfo.vacancy_name = e.target.order_name.value;
            eventBus.emit(CHANGE_ORDER, sendInfo);
        });
    }
}
