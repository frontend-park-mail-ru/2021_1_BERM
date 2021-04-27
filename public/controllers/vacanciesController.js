import {Controller} from './controller.js';
import {VacanciesView} from '@/views/vacanciesView';

import auth from '../models/Auth.js';
import vacancy from '../models/Vacancy.js';
import eventBus from '@/modules/eventBus';
import user from '../models/User.js';

import {
    GO_TO_VACANCY,
    SEND_SERVICES_VACANCIES,
    SEND_RESULT_RENDER_VACANCIES,
    VACANCIES_RENDER,
} from '../modules/utils/actions.js';

import router from '@/modules/router';


export class VacanciesController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new VacanciesView();
        this.getOrders = false;
    }

    run(id) {
        if (id) {
            this.isMyVacancies = Number(id);
            this.isI = this.isMyVacancies === user.id;
        }

        // if (!user.isExecutor && !this.isMyVacancies) {
        //     window.location.href = '/404/';
        // }
        super.run(
            [
                [GO_TO_VACANCY, this._goToVacancy.bind(this)],
                [SEND_SERVICES_VACANCIES, this._sendServices.bind(this)],
                [SEND_RESULT_RENDER_VACANCIES,
                    this._sendResultsRender.bind(this)],
            ],
            true);
    }

    _goToVacancy(id) {
        router.go(`/vacancy/${id}`);
    }


    _sendServices() {
        const tempMap = new Map;
        tempMap.set(0, {
            id: 0, //
            avatar: '', //
            login: 'bob', //
            name: 'bob2', //
            category: 'frontend', //
            definition: 'sdsd', //
            salary: 100, //
        });
        if (this.getOrders) {
            eventBus.emit(VACANCIES_RENDER, {
                isI: this.isI,
                isMyOrders: !!this.isMyOrders,
                isAuthorized: user.isAuthorized,
                isExecutor: user.isExecutor,
                map: vacancy.ordersMap,
            });
            return;
        }
        if (this.isMyVacancies) {
            auth.getMyOrders(this.isMyVacancies);
        } else {
            // auth.getVacancies();
            eventBus.emit(VACANCIES_RENDER, {
                isI: this.isI,
                isMyVacancies: !!this.isMyVacancies,
                isAuthorized: user.isAuthorized,
                isExecutor: user.isExecutor,
                map: tempMap,
            });
        }
    }

    _sendResultsRender(result) {
        if (result.ok) {
            result.json().then((result) => {
                vacancy.setVacancys(result);

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
}
