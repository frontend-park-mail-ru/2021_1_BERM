import {View} from './view.js';
import eventBus from '@/modules/eventBus.js';
import vacancyPageTemplate from '@/components/pages/vacancyPage.pug';
import {
    VACANCY_PAGE_GET_RES,
    VACANCY_PAGE_RENDER,
} from '@/modules/utils/actions.js';

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

        super.setListeners([
            [VACANCY_PAGE_RENDER, this._vacancyPageRender.bind(this)],
        ]);

        eventBus.emit(VACANCY_PAGE_GET_RES);
    }

    /**
     * Отображение страницы
     *
     * @param {Object} dataForRender
     */
    _vacancyPageRender(dataForRender) {
        super.renderHtml(
            this.isAuthorized,
            this.isExecutor,
            'Страница вакансии',
            vacancyPageTemplate(dataForRender),
        );
    }
}
