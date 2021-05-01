import {Controller} from './controller.js';
import {VacancyPageView} from '../views/vacancyPageView.js';

import vacancy from '../models/Vacancy.js';
import auth from '../models/Auth.js';
import user from '../models/User.js';

import {
    VACANCY_CHANGE_RATE, VACANCY_DELETE_EXECUTOR,
    VACANCY_DELETE_RATE, VACANCY_GET, VACANCY_GET_DELETE_EXECUTOR, VACANCY_GET_EXECUTOR,
    VACANCY_GET_RATE, VACANCY_SET_EXECUTOR,
    VACANCY_SET_RATE,
    VACANCY_PAGE_GET_RES,
    VACANCY_PAGE_GET_VACANCY,
    VACANCY_PAGE_RENDER,
    VACANCY_PAGE_RES,
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';
import router from '../modules/router.js';
import order from '@/models/Order';


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
                [VACANCY_PAGE_GET_VACANCY,
                    this._vacancyPageGetVacancy.bind(this)],
                [VACANCY_SET_RATE, this._vacancySetRate.bind(this)],
                [VACANCY_GET_RATE, this._vacancyGetRate.bind(this)],
                [VACANCY_DELETE_RATE, this._vacancyDeleteRate.bind(this)],
                [VACANCY_CHANGE_RATE, this._vacancyChangeRate.bind(this)],
                // [VACANCY_GET, this._vacancyGet.bind(this)],
                // [VACANCY_SET_EXECUTOR, this._vacancySetExecutor.bind(this)],
                // [VACANCY_GET_EXECUTOR, this._vacancySetExecutor.bind(this)],
                // [VACANCY_DELETE_EXECUTOR,
                //     this._vacancydDeleteExecutor.bind(this)],
                // [VACANCY_GET_DELETE_EXECUTOR,
                //     this._vacancyGetDeleteExecutor.bind(this)],
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
        console.log(creator.responses);

        let isMy = true;
        if (creator.customerId !== user.id) {
            isMy = false;
        }

        eventBus.emit(VACANCY_PAGE_RENDER, {
            // isMy: isMy,
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
            userRate: vacancy.findRate(vacancy.currentVacancyId, user.id),
            userText: vacancy.findTextRate(vacancy.currentVacancyId, user.id),
        });
    }

    _vacancySetRate({rate, text}) {
        const date = new Date();
        auth.vacancySetResponse({
            user_id: user.id,
            // rate: rate,
            time: date.getTime(),
            text: text,
        }, vacancy.currentVacancyId);
        eventBus.emit(VACANCY_GET_RATE);
    }

    _vacancyGetRate(res) {
        const go = this.go;
        if (res.ok) {
            res.json().then((res) => {
                vacancy.push(vacancy.currentVacancyId, res);

                go();
            });
        } else {
            console.log('Запрос не сработал');
            // ToDo Обработка ошибки запроса
        }
        // console.log(vacancy.currentVacancyId);
        // vacancy.push(vacancy.currentVacancyId, {
        //     id: '8',
        //     creatorId: 8,
        //     avatar: '',
        //     login: 'AlexDarkStalker98',
        //     rate: 1488,
        //     // date: '1617952689',
        // });
        // go();
    }

    _vacancyDeleteRate() {
        vacancy.deleteResponse(vacancy.currentVacancyId, user.id);

        auth.vacancyDeleteRate(vacancy.currentVacancyId)
            .catch(() => {
                console.log('Ошибка удаления');
            });

        this.go();
    }

    _vacancyChangeRate({text}) {
        vacancy.deleteResponse(vacancy.currentVacancyId, user.id);

        const date = new Date();
        auth.vacancyChangeResponse({
            user_id: user.id,
            text: text,
            time: date.getTime(),
        }, vacancy.currentVacancyId);
    }
}
