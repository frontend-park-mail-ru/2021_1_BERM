import {Controller} from './controller.js';
import {VacancyPageView} from '../views/vacancyPageView.js';

import vacancy from '../models/Vacancy.js';
import auth from '../models/Auth.js';
import user from '../models/User.js';

import {
    VACANCY_PAGE_GET_RES,
    VACANCY_PAGE_GET_VACANCY, VACANCY_PAGE_RENDER,
    VACANCY_PAGE_RES,
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';

export class VacancyPageController extends Controller {
    constructor() {
        super();
        this.view = new VacancyPageView();
    }

    run(id) {
        vacancy.currentVacancyId = Number(id);

        super.run(
            [
                [VACANCY_PAGE_GET_RES, this._vacancyPageGetRes.bind(this)],
                [VACANCY_PAGE_RES, this._vacancyPageRes.bind(this)],
                [VACANCY_PAGE_GET_VACANCY, this._vacancyPageGetVacancy.bind(this)],
            ],
            true,
        );
    }

    _vacancyPageGetRes() {
        if (vacancy.getVacancyById(vacancy.currentVacancyId)) {
            auth.getResponsesVacancy(vacancy.currentVacancyId);
        } else {
            auth.getVacancy(vacancy.currentVacancyId);
        }
    }

    _vacancyPageRes(res) {
        const go = this.go;

        if (res.ok) {
            res.json().then((res) => {
                vacancy.setResponses(vacancy.currentVacancyId, res);

                go();
            });
        } else {
            window.location.href = '/404/';
        }
    }

    _vacancyPageGetVacancy(res) {
        if (res.ok) {
            res.json().then((res) => {
                vacancy.setVacancys([res]);
                auth.getResponsesVacancy(vacancy.currentVacancyId);
            });
        } else {
            console.log('Запрос /order/id - не сработал');
            // ToDo Обработка ошибки запроса
        }
    }

    go() {
        const creator = vacancy.getVacancyById(vacancy.currentVacancyId);

        eventBus.emit(VACANCY_PAGE_RENDER, {
            isExecutor: user.isExecutor,
            responses: creator.responses,
            creator: {
                avatar: creator.avatar,
                name: creator.login,
                title: creator.name,
                category: creator.category,
                definition: creator.definition,
                salary: creator.salary,
            },
        });
    }
}
