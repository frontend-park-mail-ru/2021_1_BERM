import {View} from './view.js';

import page404Template from '@/components/pages/404/page404.pug';
import {starAnimation} from '@/components/pages/404/animation.js';

/** View страницы 404 */
export class Page404View extends View {
    /**
     * Отображение страницы
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.renderHtml(
            isAuthorized,
            isExecutor,
            'Ошибка 404',
            page404Template(),
            [],
        );

        starAnimation();
    }
}
