import {Controller} from '@/controllers/controller';
import {SearchView} from '@/views/searchView';
import {
    GO_TO_ORDER,
    GO_TO_VACANCY,
    SEARCH_GO, SEARCH_RENDER_CONTENT,
    SERVER_ERROR,
} from '@/modules/constants/actions';
import auth from '@/models/Auth';
import eventBus from '@/modules/eventBus';
import router from '@/modules/router';
import {getOrderPath, getVacancyPath} from '@/modules/constants/goPath';
import vacancy from '@/models/Vacancy';
import order from '@/models/Order';
import user from '@/models/User';

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
            ], true, true);
    }

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
                    order.setOrders(res);
                    data = order.ordersMap;
                    break;
                case 2:
                    vacancy.clear();
                    vacancy.setVacancys(res);
                    data = vacancy.vacancysMap;
                    break;
                case 3:
                    console.log(res);
                    return;
                    // const map = new Map();
                    // res.forEach((item, index) => {
                    //     map.set(index, item);
                    // });
                    // data = map;
                    // break;
                }

                user.searchData = {key: flag, data: data};
                eventBus.emit(SEARCH_RENDER_CONTENT, user.searchData);
            });
        });
    }

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

    _goToVacancy(id) {
        router.go(getVacancyPath(id));
    }
}
