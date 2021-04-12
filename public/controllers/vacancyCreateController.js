import {Controller} from './controller.js';
import {OrderOrVacancyCreateView} from '../views/orderOrVacancyCreateView.js';
import {
    VACANCY_SUBMIT,
    VACANCY_CREATE,
    GET_IS_ORDER_OR_VACANCY, ORDER_CREATE_GO_RENDER, NO_ORDER,
} from '../modules/utils/actions.js';

import eventBus from '../modules/eventBus.js';
import auth from '../models/Auth.js';
import vacancy from '../models/Vacancy.js';

export class VacancyCreateController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrderOrVacancyCreateView();
    }

    /**
     * Запуск контроллера создания заказа
     */
    run(id) {
        super.run(
            [
                [VACANCY_CREATE, this._vacancyCreate],
                [VACANCY_SUBMIT, this._vacancySubmit],
                [GET_IS_ORDER_OR_VACANCY, this._orderOrVacancy],
            ],
            true);
    }

    _vacancyCreate(res) {
        if (res.ok) {
            res.json()
                .then((res) => {
                    vacancy.setVacancys([res]);
                    debugger;

                    // router.go(`/vacancy/${order.currentOrderId}`);
                });
        } else {
            eventBus.emit(NO_ORDER);
        }
    }

    _vacancySubmit(info) {
        auth.vacancyCreate(info);
    }

    _orderOrVacancy() {
        eventBus.emit(ORDER_CREATE_GO_RENDER, {isOrder: false});
    }
}
