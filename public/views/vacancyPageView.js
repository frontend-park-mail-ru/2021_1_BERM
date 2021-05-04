import {View} from './view.js';
import eventBus from '@/modules/eventBus.js';
import vacancyPageTemplate from '@/components/pages/vacancyPage.pug';
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
    SERVER_ERROR, VACANCY_PAGE_FEEDBACK,
} from '@/modules/utils/actions.js';
import {notification} from '@/components/notification/notification';
import feedback from '@/components/pages/feedback.pug';

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
            [VACANCY_PAGE_FEEDBACK, this._feedback.bind(this)],
        ]);

        eventBus.emit(VACANCY_PAGE_GET_RES);
    }


    /**
     * Отображение страницы
     *
     * @param {Object} info
     */
    _vacancyPageRender(info) {
        super.renderHtml(
            this.isAuthorized,
            this.isExecutor,
            'Страница вакансии',
            vacancyPageTemplate(info),
        );

        const form = document.getElementById('Vacancy_form');
        if (info.isExecutor) {
            if (info.userRate === 0) {
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    const data = {
                        text: event.target.rate.value,
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
                        text: event.target.rate.value,
                    };

                    eventBus.emit(VACANCY_CHANGE_RATE, data);
                });
                return;
            }
        }

        if (!info.isExecutor) {
            const revButton = document.
                querySelectorAll('.vacancyPage__comment-button_info');

            revButton.forEach((but) => {
                but.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(but
                        .getAttribute('data-id-user'), ' But');
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
                    // Todo Добавить подтверждение действия
                    eventBus.emit(VACANCY_PAGE_END);
                }));
            } else {
                const deleteBtn = document
                    .querySelector('.orderPage__order_delete');

                deleteBtn.addEventListener('click', (() => {
                    // Todo Добавить подтверждение действия
                    eventBus.emit(VACANCY_PAGE_DELETE);
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

        // ToDo Не знаю, нужно это или нет
        // const bg = document.querySelector('.orderPage__feedback_bg');
        // bg.addEventListener('click', (event) => {
        //     bg.remove();
        // });
        //
        // const window = document.querySelector('.orderPage__feedback_window');
        // window.addEventListener('click', (event) => {
        //     event.stopPropagation();
        // });

        const skip = document.querySelector('.orderPage__feedback_skip');
        skip.addEventListener('click', () => {
            body.classList.remove('scroll_hidden');
            eventBus.emit(VACANCY_PAGE_SEND_FEEDBACK, {skip: true});
        });

        const form = document.getElementById('specForm');
        form.addEventListener('submit', (event) => {
            body.classList.remove('scroll_hidden');
            event.preventDefault();
            const data = {
                score: 6 - Number(event.target.rating.value),
                text: event.target.description.value,
            };

            eventBus.emit(VACANCY_PAGE_SEND_FEEDBACK, data);
        });
    }
}
