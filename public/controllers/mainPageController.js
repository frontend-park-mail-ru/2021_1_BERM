import {Controller} from './controller.js';
import {MainPageView} from '../views/mainPageView.js';

/** Контроллер регистрации клиента */
export class MainPageController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
    }

    /**
     * Запуск контроллера главной страницы
     */
    run() {
        super.run(
            new MainPageView(),
            []);
    }
}
