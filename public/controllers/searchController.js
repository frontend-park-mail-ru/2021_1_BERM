import {Controller} from '@/controllers/controller';
import {SearchView} from '@/views/searchView';
import {SEARCH_GO} from '@/modules/constants/actions';
import user from '@/models/User';
import auth from '@/models/Auth';

/** Контроллер страницы поиска */
export class SearchController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new SearchView();
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
        }

        res.then((res) => {
            if (!res.ok) {
                alert('ПИЗДА');
            }

            res.json((res) => {
                console.log(res);
            });
        });
    }

    parseDataToQuery(data) {
        debugger;

        let res = '?';
        Object.entries(data).forEach(([key, value]) => {
            if (value.toString().length !== 0) {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        res = res.concat(`${key}=${item
                            .split(' ')
                            .join('+')
                            .toString()}`, `&`);
                    });
                } else {
                    res = res.concat(`${key}=${value.toString()}`, `&`);
                }
            }
        });

        return res.slice(0, res.length - 1);
    }
}
