import {Controller} from '@/controllers/controller';
import {SearchView} from '@/views/searchView';

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
            ], true, true);
    }
}
