import {View} from './view.js';
import {
    REVIEWS_ERROR,
    REVIEWS_GET_DATA,
    REVIEWS_RENDER,
} from '@/modules/constants/actions';
import {notification} from '@/components/notification/notification';

import reviewsTemplate from '@/components/pages/reviews.pug';
import eventBus from '@/modules/eventBus';

export class ReviewsView extends View {
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
            [REVIEWS_RENDER, this._renderData.bind(this)],
            [REVIEWS_ERROR, this._error.bind(this)],
        ]);
        eventBus.emit(REVIEWS_GET_DATA);
    }

    _renderData(dataForRender) {
        super.renderHtml(
            this.isAuthorized,
            this.isExecutor,
            'Отзывы',
            reviewsTemplate(dataForRender),
        );
    }

    _error(str) {
        notification(`Ошибка сервера! ${str}`);
    }
}
