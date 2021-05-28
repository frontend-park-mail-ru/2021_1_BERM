import {Controller} from './controller.js';
import {OrderOrVacancyCreateView} from '@/views/orderOrVacancyCreateView.js';
import {
    VACANCY_SUBMIT,
    VACANCY_CREATE,
    ORDER_CREATE_OR_VACANCY,
    ORDER_CREATE_GO_RENDER,
    NO_ORDER,
} from '@/modules/constants/actions.js';
import eventBus from '@/modules/eventBus.js';
import auth from '@/models/Auth.js';
import vacancy from '@/models/Vacancy.js';
import router from '@/modules/router.js';
import {getNotFoundPath, getVacancyPath} from '@/modules/constants/goPath.js';
import user from '@/models/User';

/** Контроллер создания вакансии */
export class VacancyCreateController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new OrderOrVacancyCreateView();
    }

    /**
     * Запуск контроллера создания вакансии
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        if (user.isExecutor) {
            router.go(getNotFoundPath);
        }

        super.run(
            [
                [VACANCY_CREATE, this._vacancyCreate],
                [VACANCY_SUBMIT, this._vacancySubmit],
                [ORDER_CREATE_OR_VACANCY, this._orderOrVacancy],
            ],
            true);
    }

    /**
     * Обработка результата
     *
     * @param {Response} res - результат запроса
     */
    _vacancyCreate(res) {
        if (res.ok) {
            res.json()
                .then((res) => {
                    vacancy.setVacancys([res]);
                    router.go(getVacancyPath(vacancy.currentVacancyId));
                });
        } else {
            eventBus.emit(NO_ORDER);
        }
    }

    /**
     * Отправка вакансии
     *
     * @param {Object} info - данные на отправку
     */
    _vacancySubmit(info) {
        auth.vacancyCreate(info);
    }

    /**
     * Метод необходимый для передачи параметра,
     * определяющего отрисовку или заказа, или вакансии
     */
    _orderOrVacancy() {
        eventBus.emit(ORDER_CREATE_GO_RENDER, {isOrder: false});
    }
}
