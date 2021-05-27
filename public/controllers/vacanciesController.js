import {Controller} from './controller.js';
import {VacanciesView} from '@/views/vacanciesView';

import auth from '@/models/Auth.js';
import vacancy from '@/models/Vacancy.js';
import eventBus from '@/modules/eventBus';
import user from '@/models/User.js';

import {
    GO_TO_VACANCY,
    SEND_SERVICES_VACANCIES,
    SEND_RESULT_RENDER_VACANCIES,
    VACANCIES_RENDER,
    VACANCIES_PAGE_SEARCH,
} from '@/modules/constants/actions';

import router from '@/modules/router';
import {getNotFoundPath, getVacancyPath} from '@/modules/constants/goPath';

/** Контроллер страницы вакансий */
export class VacanciesController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new VacanciesView();
        this.getVacancies = false;
    }

    /**
     * Запуск контроллера страницы вакансий
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        if (id) {
            this.isMyVacancies = Number(id);
            this.isI = this.isMyVacancies === user.id;
        }

        if (!user.isExecutor && !this.isI) {
            router.go(getNotFoundPath);
            return;
        }

        super.run(
            [
                [GO_TO_VACANCY, this._goToVacancy.bind(this)],
                [SEND_SERVICES_VACANCIES, this._sendServices.bind(this)],
                [SEND_RESULT_RENDER_VACANCIES,
                    this._sendResultsRender.bind(this)],
                [VACANCIES_PAGE_SEARCH, this._search.bind(this)],
            ],
            true);
    }

    /**
     * Переход к конкретной вакансии
     *
     * @param {number} id - id вакансии
     */
    _goToVacancy(id) {
        router.go(getVacancyPath(id));
    }

    /**
     * Получаем информацию о вакансии, если ее нет
     */
    _sendServices() {
        if (this.isMyVacancies) {
            auth.getMyVacancies(this.isMyVacancies);
            return;
        }

        auth.getVacancies();
    }

    /**
     * Отправляем данные для рендеринга
     *
     * @param {Response} result - результат запроса
     */
    _sendResultsRender(result) {
        if (result.ok) {
            result.json().then((result) => {
                vacancy.clear();
                vacancy.setVacancys(result.vacancy ? result.vacancy : result);

                eventBus.emit(VACANCIES_RENDER, {
                    isI: this.isI,
                    isMyVacancies: !!this.isMyVacancies,
                    isAuthorized: user.isAuthorized,
                    isExecutor: user.isExecutor,
                    map: vacancy.vacancysMap,
                });
            });
        }
    }

    /**
     * Ищем совпадения
     *
     * @param {Response} data - поиск
     */
    _search(data) {
        auth.searchVacancies(data)
            .then((res) => {
                this._sendResultsRender(res);
            });
    }
}
