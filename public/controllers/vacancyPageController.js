import {Controller} from './controller.js';
import {VacancyPageView} from '@/views/vacancyPageView';

import vacancy from '@/models/Vacancy.js';
import auth from '@/models/Auth.js';
import user from '@/models/User.js';

import {
    VACANCY_CHANGE_RATE,
    VACANCY_DELETE_EXECUTOR,
    VACANCY_DELETE_RATE,
    VACANCY_GET_DELETE_EXECUTOR,
    VACANCY_GET_EXECUTOR,
    VACANCY_GET_RATE,
    VACANCY_SET_EXECUTOR,
    VACANCY_SET_RATE,
    VACANCY_PAGE_GET_RES,
    VACANCY_PAGE_GET_VACANCY,
    VACANCY_PAGE_RENDER,
    VACANCY_PAGE_RES,
    GO_TO_USER,
    VACANCY_PAGE_END,
    VACANCY_PAGE_DELETE,
    SERVER_ERROR,
    CHANGE_VACANCY,
} from '@/modules/constants/actions.js';
import eventBus from '@/modules/eventBus.js';
import router from '@/modules/router.js';

import {
    getNotFoundPath,
    getProfilePath,
    getVacancyPath,
} from '@/modules/constants/goPath.js';

/** Контроллер страницы вакансии */
export class VacancyPageController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new VacancyPageView();
    }

    /**
     * Запуск контроллера страницы вакансии
     *
     * @param {number} id - id из url, если он там был
     */
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
                [VACANCY_SET_EXECUTOR, this._vacancySetExecutor.bind(this)],
                [VACANCY_GET_EXECUTOR, this._vacancyGetExecutor.bind(this)],
                [VACANCY_DELETE_EXECUTOR,
                    this._vacancyDeleteExecutor.bind(this)],
                [VACANCY_GET_DELETE_EXECUTOR,
                    this._vacancyGetDeleteExecutor.bind(this)],
                [GO_TO_USER, this._goToUser.bind(this)],
                [VACANCY_PAGE_END, this._endVacancy.bind(this)],
                [VACANCY_PAGE_DELETE, this._deleteVacancy.bind(this)],
                [CHANGE_VACANCY, this._changeVacancy.bind(this)],
            ],
            true,
        );
    }

    /**
     * Переходим на страницу пользователя.
     *
     * @param {number} id пользователя
     */
    _goToUser(id) {
        router.go(`/profile/${id}`);
    }

    /**
     * Определяем недостающие данные и делаем запрос
     */
    _vacancyPageGetRes() {
        if (vacancy.getVacancyById(vacancy.currentVacancyId)) {
            auth.getResponsesVacancy(vacancy.currentVacancyId);
        } else {
            auth.getVacancy(vacancy.currentVacancyId);
        }
    }

    /**
     * Получаем данные откликов
     *
     * @param {Response} res - результат запроса на заказ
     */
    _vacancyPageRes(res) {
        const go = this.go;

        if (res.ok) {
            res.json().then((res) => {
                vacancy.setResponses(vacancy.currentVacancyId, res);

                go();
            });
        } else {
            router.go(getNotFoundPath);
        }
    }

    /**
     * Получаем данные вакансии и делаем запрос на отклики
     *
     * @param {Response} res - результат запроса на вакансию
     */
    _vacancyPageGetVacancy(res) {
        if (res.ok) {
            res.json().then((res) => {
                vacancy.setVacancys([res]);
                auth.getResponsesVacancy(vacancy.currentVacancyId);
            });
        } else {
            router.go(getNotFoundPath);
        }
    }

    /**
     * Отправляем данные view для отрисовки
     */
    go() {
        const creator = vacancy.getVacancyById(vacancy.currentVacancyId);

        let isMy = true;
        if (creator.customerId !== user.id) {
            isMy = false;
        }

        eventBus.emit(VACANCY_PAGE_RENDER, {
            isArchived: vacancy
                .getVacancyById(vacancy.currentVacancyId).isArchived,
            isMy: isMy,
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
            userText: vacancy.findTextRate(vacancy.currentVacancyId, user.id),
            selectExecutor: vacancy.getSelectResponse(
                vacancy.currentVacancyId,
                vacancy.vacancysMap
                    .get(vacancy.currentVacancyId).selectExecutor),
        });
    }

    /**
     * Устанавливаем новую ставку.
     *
     * @param {number} rate - ставка заказа
     */
    _vacancySetRate({text}) {
        const date = new Date();
        auth.vacancySetResponse({
            user_id: user.id,
            time: date.getTime(),
            text: text,
        }, vacancy.currentVacancyId);
        eventBus.emit(VACANCY_GET_RATE);
    }

    /**
     * Устанавливаем новую ставку.
     *
     * @param {Response} res - результат запроса на установление ставки
     */
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
    }

    /**
     * Запрос на удаление ставки
     */
    _vacancyDeleteRate() {
        vacancy.deleteResponse(vacancy.currentVacancyId, user.id);

        auth.vacancyDeleteRate(vacancy.currentVacancyId)
            .catch(() => {
            });

        this.go();
    }

    /**
     * Устанавливаем новую ставку.
     *
     * @param {number} text - ставка заказа
     */
    _vacancyChangeRate({text}) {
        vacancy.deleteResponse(vacancy.currentVacancyId, user.id);

        const date = new Date();
        auth.vacancyChangeResponse(vacancy.currentVacancyId, {
            user_id: user.id,
            text: text,
            time: date.getTime(),
        });
    }

    /**
     * Выбираем исполнителя.
     *
     * @param {number} id исполнителя
     */
    _vacancySetExecutor(id) {
        this.selectExecutorId = id;
        auth.vacancySetExecutor(vacancy.currentVacancyId, {executor_id: id});
    }

    /**
     * Получаем ответ на запрос о установке исполнителя
     *
     * @param {Response} res - результат запроса на выбор исполнителя
     */
    _vacancyGetExecutor(res) {
        if (res.ok) {
            vacancy.vacancysMap
                .get(vacancy.currentVacancyId)
                .selectExecutor = this.selectExecutorId;
            this.go();
        } else {
            eventBus.emit(SERVER_ERROR,
                'Не удалось выбрать исполнителя');
        }
    }

    /**
     * Отменяем ислонителя
     */
    _vacancyDeleteExecutor() {
        auth.vacancyDeleteExecutor(vacancy.currentVacancyId);
    }

    /**
     * Получаем ответ на запрос о отмене исполнителя
     *
     * @param {Response} res - результат запроса на отмену исполнителя
     */
    _vacancyGetDeleteExecutor(res) {
        if (res.ok) {
            vacancy.vacancysMap.
                get(vacancy.currentVacancyId).selectExecutor = null;
            this.go();
        } else {
            eventBus.emit(SERVER_ERROR,
                'Не удалось отказаться от исполнителя');
        }
    }

    /**
     * Логика завершения вакансии
     */
    _endVacancy() {
        auth.endVacancy(vacancy.currentVacancyId)
            .then((res) => {
                if (!res.ok) {
                    eventBus.emit(SERVER_ERROR,
                        'Не удалось завершить вакансию');
                    return;
                }

                router.go(getVacancyPath(vacancy.currentVacancyId));
            });
    }

    /**
     * Логика удаления вакансии
     */
    _deleteVacancy() {
        auth.deleteVacancy(vacancy.currentVacancyId)
            .then((res) => {
                if (!res.ok) {
                    eventBus.emit(SERVER_ERROR,
                        'Не удалось удалить вакансию');
                    return;
                }
                router.go(getProfilePath(user.id));
            });
    }

    /**
     * Логика отзыва
     *
     * @param {Object} info - содержание изменений
     */
    _changeVacancy(info) {
        auth.changeVacancy(vacancy.currentVacancyId, info);
    }
}
