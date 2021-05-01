import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import vacancyPageTemplate from '@/components/pages/vacancyPage.pug';
import {
    VACANCY_PAGE_RENDER,
    VACANCY_PAGE_GET_RES,
    VACANCY_SET_RATE,
    VACANCY_DELETE_RATE,
    VACANCY_CHANGE_RATE,
    VACANCY_SET_EXECUTOR,
    VACANCY_ERROR_SET,
    VACANCY_DELETE_EXECUTOR,
    VACANCY_ERROR_DELETE_EX,
    ORDER_DELETE_RATE,
    ORDER_CHANGE_RATE,
    ORDER_DELETE_EXECUTOR, ORDER_SET_EXECUTOR,

} from '../modules/utils/actions.js';

export class VacancyPageView extends View {
    render(isAuthorized, isExecutor) {
        this.isAuthorized = isAuthorized;
        this.isExecutor = isExecutor;
        this.isCreated = true;

        super.setListeners([
            [VACANCY_PAGE_RENDER, this._vacancyPageRender.bind(this)],
        ]);

        eventBus.emit(VACANCY_PAGE_GET_RES);
    }

    _vacancyPageRender(info) {
        console.log(info);
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
                    console.log("PROVEKRA  ", event.target.rate.value);
                    const data = {
                        text: event.target.rate.value,
                    };
                    console.log(data.text);

                    eventBus.emit(VACANCY_SET_RATE, data);
                });
            } else {
                const deleteButton = document
                    .querySelector('.vacancy-executor__button_delete');

                deleteButton.addEventListener('click', (event) => {
                    event.preventDefault();
                    console.log('hui');
                    debugger;
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

            if (!info.isExecutor) {
                if (info.selectExecutor) {
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
    }
}
