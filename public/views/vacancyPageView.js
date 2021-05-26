import {View} from './view.js';
import eventBus from '@/modules/eventBus.js';
import vacancyPageTemplate from '@/components/pages/vacancy/vacancyPage.pug';
import createOrderOrVacancy
    from '@/components/pages/createOrderVacancy/createOrderOrVacancy.pug';
import {
    VACANCY_PAGE_RENDER,

    VACANCY_PAGE_GET_RES,
    VACANCY_SET_RATE,
    VACANCY_DELETE_RATE,
    VACANCY_CHANGE_RATE,
    VACANCY_SET_EXECUTOR,
    VACANCY_DELETE_EXECUTOR,
    GO_TO_USER,
    VACANCY_PAGE_DELETE,
    VACANCY_PAGE_END,
    SERVER_ERROR,
    CHANGE_VACANCY,
    NOTIF_CHANGE_VALID,
    CHANGE_VACANCY_RENDER,
} from '@/modules/constants/actions.js';
import {notification} from '@/components/notification/notification';
import Select from '@/modules/utils/customSelect';
import {listOfServices} from '@/modules/utils/templatesForSelect';
import {Validator} from '@/views/validation/validator';
import {confim} from '@/components/modelWindows/confim/confim';
import PriceHandler from '@/modules/utils/priceHandler';

/** View страницы вакансии */
export class VacancyPageView extends View {
    /**
     * Установка обработчиков
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        this.isAuthorized = isAuthorized;
        this.isExecutor = isExecutor;
        this.isCreated = true;

        super.setListeners([
            [VACANCY_PAGE_RENDER, this._vacancyPageRender.bind(this)],
            [SERVER_ERROR, this._error.bind(this)],
            [CHANGE_VACANCY_RENDER, this._changeVacancyRender],
            [NOTIF_CHANGE_VALID, this._notifChangeValid],
        ]);

        eventBus.emit(VACANCY_PAGE_GET_RES);
    }


    /**
     * Отображение страницы
     *
     * @param {Object} info
     */
    _vacancyPageRender(info) {
        console.log(info);
        this._conversionToCurrency(info);
        super.renderHtml(
            this.isAuthorized,
            this.isExecutor,
            'Страница вакансии',
            vacancyPageTemplate(info),
        );

        if (info.isArchived) {
            return;
        }

        const form = document.getElementById('Vacancy_form');
        if (info.isExecutor) {
            const val = new Validator(
                'Vacancy_form',
                '.form-control',
                'send_mess');
            const element = document.querySelector('.form-control');
            const prevValue = element.value;
            val.validate();
            if (info.userText === '') {
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const data = {
                        text: event.target.rateExecutor.value,
                    };

                    eventBus.emit(VACANCY_SET_RATE, data);
                });
            } else {
                const deleteButton = document
                    .querySelector('.vacancy-executor__button_delete');

                deleteButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    eventBus.emit(VACANCY_DELETE_RATE);
                });

                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const data = {
                        text: event.target.rateExecutor.value,
                    };
                    if (prevValue !== data.text) {
                        eventBus.emit(VACANCY_CHANGE_RATE, data);
                    } else {
                        this._errorChange();
                        document.querySelector('.orderPage__comments').classList
                            .remove('form-control_valid');
                    }
                });
                return;
            }
        }

        if (!info.isExecutor) {
            const changeButton = document.
                querySelector('.vacancyPage__customer-button_change');

            changeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this._changeVacancyRender(info);
            });

            const revButton = document.
                querySelectorAll('.vacancyPage__comment-button_info');

            revButton.forEach((but) => {
                but.addEventListener('click', (e) => {
                    e.preventDefault();
                    eventBus.emit(GO_TO_USER, but
                        .getAttribute('data-id-user'));
                });
            });
            if (info.selectExecutor) {
                const deleteButton = document
                    .querySelector(
                        '.vacancyPage__comment-button_cancel');

                deleteButton.addEventListener('click', () => {
                    eventBus.emit(VACANCY_DELETE_EXECUTOR);
                });

                const endBtn = document
                    .querySelector('.orderPage__order_end');

                endBtn.addEventListener('click', (() => {
                    confim(
                        (event) => {
                            event.preventDefault();
                            const elem = document
                                .getElementById('confim_window');
                            elem.parentNode.removeChild(elem);
                            eventBus.emit(VACANCY_PAGE_END);
                        });
                }));
            } else {
                const deleteBtn = document
                    .querySelector('.orderPage__order_delete');

                deleteBtn.addEventListener('click', (() => {
                    confim(
                        (event) => {
                            event.preventDefault();
                            eventBus.emit(VACANCY_PAGE_DELETE);
                        });
                }));

                const selectButtons = document
                    .querySelectorAll(
                        '.vacancyPage__comment-button_select');

                selectButtons.forEach((item) => {
                    item.addEventListener('click', (event) => {
                        const id = event.target.getAttribute('data-id');
                        eventBus.emit(VACANCY_SET_EXECUTOR, Number(id));
                    });
                });
            }
        }
    }

    /**
     * Преобразование числа в рубли
     *
     * @param {Object} dataForRender
     */
    _conversionToCurrency(dataForRender) {
        debugger;
        console.log(String(dataForRender.creator.salary).indexOf('₽'));
        if (String(dataForRender.creator.salary).indexOf('₽') === -1) {
            dataForRender.creator.salary += '₽';
        }
        dataForRender.responses.forEach((item) => {
            item.rate += '₽';
        });
        if (dataForRender.userRate) {
            dataForRender.userRate += '₽';
        }
        if (dataForRender.selectExecutor) {
            dataForRender.selectExecutor.salary += '₽';
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
     * Ошибка на изменение данных
     */
    _errorChange() {
        notification(`Измените, пожалуйста, данные`);
    }

    /**
     *  Изменения приняты
     */
    _notifChangeValid() {
        const validColor = true;
        notification(`Изменения приняты`, validColor);
    }

    /**
     * Рендер изменения вакансии
     *
     * @param {Object} info
     */
    _changeVacancyRender(info) {
        const form = document.querySelector(' .orderPage');
        const isChange = true;
        info.creator.salary = info.creator.salary.slice(0, -1);
        const chInfo = {
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
        const val = new Validator(
            'order-create_form',
            '.form-control',
            'send_mess',
        );
        val.validate();
        const prHandler = new PriceHandler('budget');
        prHandler.start();

        const cancelButton = document.
            querySelector('.change-form__cancel');
        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            eventBus.emit(VACANCY_PAGE_GET_RES);
        });

        const changeForm = document.
            getElementById('order-create_form');

        changeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sendInfo = {
                category: e.target.category.value,
                description: e.target.description.value,
            };
            sendInfo.salary = Number(e.target.budget.value);
            sendInfo.vacancy_name = e.target.order_name.value;
            eventBus.emit(CHANGE_VACANCY, sendInfo);
        });
    }
}
