import {Controller} from '@/controllers/controller.js';
import {Page404View} from '@/views/page404View.js';

/** Контроллер 404 */
export class Page404Controller extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new Page404View();
    }

    /**
     * Запуск контроллера cтраницы 404
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        super.run(
            [],
            false,
            true);
    }
}
