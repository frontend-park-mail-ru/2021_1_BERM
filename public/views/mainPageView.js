import {View} from './view.js';

import indexTemplate from '@/templates/index.pug';

/** View главной страницы */
export class MainPageView extends View {
    /**
     * Отображение страницы и получение с нее данных
     */
    render() {
        super.renderHtml(
            'FindFreelance.ru',
            indexTemplate(),
            [],
        );
    }
}
