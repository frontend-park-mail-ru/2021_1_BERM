import {Controller} from './controller.js';
import {MainPageView} from '@/views/mainPageView';

/** Контроллер регистрации клиента */
export class MainPageController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new MainPageView();
    }

    /**
     * Запуск контроллера регистрации клиента
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        super.run(
            [],
            false);
    }
}
