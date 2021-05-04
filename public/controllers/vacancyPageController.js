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
    VACANCY_PAGE_SEND_FEEDBACK,
    SERVER_ERROR,
    VACANCY_PAGE_FEEDBACK,
    CHANGE_VACANCY,
} from '@/modules/utils/actions.js';
import eventBus from '@/modules/eventBus.js';
import router from '@/modules/router.js';

import {getNotFoundPath, getProfilePath} from '@/modules/utils/goPath.js';
import order from '@/models/Order';

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
                    this._vacancydDeleteExecutor.bind(this)],
                [VACANCY_GET_DELETE_EXECUTOR,
                    this._vacancyGetDeleteExecutor.bind(this)],
                [GO_TO_USER, this._goToUser.bind(this)],

                [VACANCY_PAGE_END, this._endVacancy.bind(this)],
                [VACANCY_PAGE_DELETE, this._deleteVacancy.bind(this)],
                [VACANCY_PAGE_SEND_FEEDBACK, this._sendFeedback.bind(this)],
                [CHANGE_VACANCY, this._changeVacancy.bind(this)],
            ],
            true,
        );
    }


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
            // ToDo Обработка ошибки запроса
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
            userRate: vacancy.findRate(vacancy.currentVacancyId, user.id),
            userText: vacancy.findTextRate(vacancy.currentVacancyId, user.id),
            selectExecutor: vacancy.getSelectResponse(
                vacancy.currentVacancyId,
                vacancy.vacancysMap
                    .get(vacancy.currentVacancyId).selectExecutor),
        });
    }

    _vacancySetRate({text}) {
        const date = new Date();
        auth.vacancySetResponse({
            user_id: user.id,
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
    }

    _vacancyDeleteRate() {
        vacancy.deleteResponse(vacancy.currentVacancyId, user.id);

        auth.vacancyDeleteRate(vacancy.currentVacancyId)
            .catch(() => {
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

    _vacancySetExecutor(id) {
        this.selectExecutorId = id;
        auth.vacancySetExecutor(vacancy.currentVacancyId, {executor_id: id});
    }

    _vacancyGetExecutor(res) {
        if (res.ok) {
            vacancy.vacancysMap
                .get(vacancy.currentVacancyId)
                .selectExecutor = this.selectExecutorId;
            this.go();
        } else {
            // eventBus.emit(VACANCY_ERROR_SET);
        }
    }

    _vacancydDeleteExecutor() {
        auth.vacancyDeleteExecutor(vacancy.currentVacancyId);
    }

    _vacancyGetDeleteExecutor(res) {
        if (res.ok) {
            vacancy.vacancysMap.
                get(vacancy.currentVacancyId).selectExecutor = null;
            this.go();
        } else {
            // eventBus.emit(VACANCY_ERROR_DELETE_EX);
        }
    }

    /**
     * Логика завершения вакансии
     */
    _endVacancy() {
        auth.endVacancy(order.currentOrderId)
            .then((res) => {
                if (!res.ok) {
                    eventBus.emit(SERVER_ERROR,
                        'Не удалось завершить вакансию');
                    return;
                }
                // Todo Переход на все вакансии или в архив
                router.go(getProfilePath(user.id));
                // eventBus.emit(VACANCY_PAGE_FEEDBACK);
            });
    }

    /**
     * Логика удаления вакансии
     */
    _deleteVacancy() {
        auth.deleteVacancy(order.currentOrderId)
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
     * @param {Object} data - содержание отзыва
     */
    _sendFeedback(data) {
        if (data.skip) {
            router.go(getProfilePath(user.id));
        }

        // const select = order.getSelectResponse(
        //     order.currentOrderId,
        //     order.ordersMap.get(order.currentOrderId).selectExecutor);
        //
        // data.user = user.id;
        // data.to_user = select.creatorId;
        // data.order_id = order.currentOrderId;

        auth.sendFeedback(data)
            .then((res) => {
                if (!res.ok) {
                    eventBus.emit(SERVER_ERROR,
                        'Не удалось оставить отклик');
                    return;
                }
                router.go(getProfilePath(user.id));
            });
    }

    _changeVacancy(info) {
        auth.changeVacancy(vacancy.currentVacancyId, info);
    }
}
