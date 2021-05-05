import {Controller} from '@/controllers/controller';
import {
    REVIEWS_ERROR,
    REVIEWS_GET_DATA,
    REVIEWS_GO_ORDER,
    REVIEWS_RENDER,
} from '@/modules/constants/actions';
import auth from '@/models/Auth';
import eventBus from '@/modules/eventBus';
import user from '@/models/User';
import router from '@/modules/router';
import {getOrderPath} from '@/modules/constants/goPath';
import {ReviewsView} from '@/views/reviewsView';

export class ReviewsController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new ReviewsView();
    }

    /**
     * Запуск контроллера страницы заказов
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        this.currentId = id;

        super.run(
            [
                [REVIEWS_GET_DATA, this._getData.bind(this)],
                [REVIEWS_GO_ORDER, this._goOrder.bind(this)],
            ],
            true);
    }

    _getData() {
        auth.getReviews(this.currentId)
            .then((res) => {
                if (!res.ok) {
                    eventBus.emit(REVIEWS_RENDER, {
                        name: 'Имя Пользователя',
                        login: 'Логин',
                        reviews: [],
                    });

                    eventBus.emit(REVIEWS_ERROR, 'Не удалось получить отзывы');
                    return;
                }

                res.json()
                    .then((r) => {
                        eventBus.emit(REVIEWS_RENDER, {
                            name: r.name_surname,
                            login: r.login,
                            reviews: r.reviews,
                        });
                    });
            });
    }

    _goOrder(id) {
        router.go(getOrderPath(id));
    }
}
