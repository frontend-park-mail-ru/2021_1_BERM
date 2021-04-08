import {View} from './view.js';

import indexTemplate from '@/templates/index.pug';

/** View главной страницы */
export class MainPageView extends View {
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
            'FindFreelance.ru',
            indexTemplate(),
            [],
        );
    }
}
