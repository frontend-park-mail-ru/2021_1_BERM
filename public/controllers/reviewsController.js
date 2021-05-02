import {Controller} from '@/controllers/controller';
import {
    REVIEWS_ERROR,
    REVIEWS_GET_DATA,
    REVIEWS_GO_ORDER,
    REVIEWS_RENDER,
} from '@/modules/utils/actions';
import auth from '@/models/Auth';
import eventBus from '@/modules/eventBus';
import user from '@/models/User';
import router from '@/modules/router';
import {getOrderPath} from '@/modules/utils/goPath';
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

                // res.json((r) => {
                eventBus.emit(REVIEWS_RENDER, {
                    name: 'Имя Пользователя',
                    login: 'Логин',
                    reviews: [{
                        title: 'Нужно сделать децентрализованный интернет',
                        stars: 3,
                        sender: 'piedpipper',
                        comment: 'Все бы ничего, но этот дурак, взял и сломал систему тем, что добавил в базу данных картинки. ЗАЧЕМ?',
                    },
                    {
                        title: 'Нужно сделать децентрализованный интернет',
                        stars: 1,
                        sender: 'piedpipper',
                        comment: 'Все бы ничего, но этот дурак, взял и сломал систему тем, что добавил в базу данных картинки. ЗАЧЕМ?',
                    },
                    {
                        title: 'Нужно сделать децентрализованный интернет',
                        stars: 5,
                        sender: 'piedpipper',
                        comment: 'Все бы ничего, но этот дурак, взял и сломал систему тем, что добавил в базу данных картинки. ЗАЧЕМ?',
                    }], // Todo Подставить ответ запроса
                });
                // });
            });
    }

    _goOrder(id) {
        router.go(getOrderPath(id));
    }
}
