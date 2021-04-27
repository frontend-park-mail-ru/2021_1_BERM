import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import vacancyPageTemplate from '@/components/pages/vacancyPage.pug';
import {
    VACANCY_PAGE_GET_RES,
    VACANCY_PAGE_RENDER,
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
        super.renderHtml(
            this.isAuthorized,
            this.isExecutor,
            'Страница вакансии',
            vacancyPageTemplate(info),
        );
    }
}
