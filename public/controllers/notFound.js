import {Controller} from '@/controllers/controller.js';

/** Контроллер 404 */
export class NotFoundController extends Controller {
    /**
     * Запуск контроллера cтраницы 404
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        window.location.href = '/404/';
    }
}
