import {Controller} from '@/controllers/controller';
import {SearchView} from '@/views/searchView';
import avatar from '@/static/img/profileAvatar.svg';
import {
    GO_TO_ORDER,
    GO_TO_VACANCY,
    SEARCH_GO, SEARCH_RENDER_CONTENT, SEARCH_SUGGEST, SEARCH_SUGGEST_RENDER,
    SERVER_ERROR,
} from '@/modules/constants/actions';
import auth from '@/models/Auth';
import eventBus from '@/modules/eventBus';
import router from '@/modules/router';
import {getOrderPath, getVacancyPath} from '@/modules/constants/goPath';
import vacancy from '@/models/Vacancy';
import order from '@/models/Order';
import user from '@/models/User';
import {imgUrl} from '@/modules/constants/constants';

/** Контроллер страницы поиска */
export class SearchController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        const data = {};
        if (user.searchData) {
            data.key = user.searchData.key;
            data.data = user.searchData.data;
        }

        this.view = new SearchView(data);
    }

    /**
     * Запуск контроллера страницы поиска
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        super.run(
            [
                [SEARCH_GO, this._searchGo.bind(this)],
                [GO_TO_ORDER, this._goToOrder.bind(this)],
                [GO_TO_VACANCY, this._goToVacancy.bind(this)],
                [SEARCH_SUGGEST, this._suggest.bind(this)],
            ], true, true);
    }

    /**
     * Выполнение поиска
     *
     * @param {Object} data
     */
    _searchGo(data) {
        let flag;
        if (data.what === 'Только заказы') {
            flag = 1;
        } else if (data.what === 'Только вакансии') {
            flag = 2;
        } else {
            flag = 3;
        }

        data.what = '';

        data.limit = 10;
        data.offset = 0;

        const query = this.parseDataToQuery(data);

        let res;

        if (flag === 1) {
            res = auth.searchAllOrders(query);
        } else if (flag === 2) {
            res = auth.searchAllVacancies(query);
        } else {
            res = auth.searchAllUsers(query);
        }

        res.then((res) => {
            if (!res.ok) {
                eventBus.emit(SERVER_ERROR, 'Поиск не выполнен');
            }

            res.json().then((res) => {
                let data;

                switch (flag) {
                case 1:
                    order.clear();
                    order.setOrders(res.order);
                    data = order.ordersMap;
                    break;
                case 2:
                    vacancy.clear();
                    vacancy.setVacancys(res.vacancy);
                    data = vacancy.vacancysMap;
                    break;
                case 3:
                    const map = new Map();
                    res.forEach((item, index) => {
                        item.img = item.img ? imgUrl + item.img : avatar;
                        map.set(index, item);
                    });
                    data = map;
                    break;
                }

                user.searchData = {key: flag, data: data};
                eventBus.emit(SEARCH_RENDER_CONTENT, user.searchData);
            });
        });
    }

    /**
     * Перевод объекта в query параметры
     *
     * @param {Object} data
     * @return {string}
     */
    parseDataToQuery(data) {
        let res = '?';
        Object.entries(data).forEach(([key, value]) => {
            if (value.toString().length !== 0) {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        res = res.concat(`${key}=${item.toString()
                            .split(' ')
                            .join('+')}`, `&`);
                    });
                } else {
                    res = res.concat(`${key}=${value.toString()
                        .split(' ')
                        .join('+')}`, `&`);
                }
            }
        });

        return res.slice(0, res.length - 1);
    }

    /**
     * Переход к конкретному заказу
     *
     * @param {number} id - id заказа
     */
    _goToOrder(id) {
        router.go(getOrderPath(id));
    }

    /**
     * Переход к конкретной вакансии
     *
     * @param {number} id - id заказа
     */
    _goToVacancy(id) {
        router.go(getVacancyPath(id));
    }

    /**
     * Запро на саджесты
     *
     * @param {Object} data - id заказа
     */
    _suggest(data) {
        let flag;
        if (data.what === 'Только заказы') {
            flag = 1;
        } else if (data.what === 'Только вакансии') {
            flag = 2;
        } else {
            flag = 3;
        }

        data.what = '';

        const query = this.parseDataToQuery(data);

        let res;
        if (flag === 1) {
            res = auth.searchSuggestOrders(query);
        } else if (flag === 2) {
            res = auth.searchSuggestVacancies(query);
        } else {
            res = auth.searchSuggestUsers(query);
        }

        res.then((res) => {
            res.json().then((res) => {
                eventBus.emit(SEARCH_SUGGEST_RENDER, res);
            });
        });
    }
}
