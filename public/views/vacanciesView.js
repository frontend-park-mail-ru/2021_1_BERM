import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import {
    SEND_SERVICES_VACANCIES,
    VACANCIES_RENDER,
    GO_TO_VACANCY,
} from '@/modules/constants/actions';
import ordersTemplate from '@/components/pages/vacancies /vacancies.pug';

/** View страницы всех вакансий */
export class VacanciesView extends View {
    /**
     * Установка обработчиков
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [VACANCIES_RENDER, this._renderDataVacancies],
        ]);
        eventBus.emit(SEND_SERVICES_VACANCIES);
    }

    /**
     * Отображение страницы
     *
     * @param {Object} dataMap
     */
    _renderDataVacancies(dataMap) {
        const map = [];
        for (const item of dataMap.map.values()) {
            map.push(item);
        }

        super.renderHtml(
            dataMap.isAuthorized,
            dataMap.isExecutor,
            'Все заказы',
            ordersTemplate({
                vacancies: map,
                isI: dataMap.isI,
                isMyVacancies: dataMap.isMyVacancies,
            }),
        );

        // if (!dataMap.isMyVacancies && !dataMap.isArchive) {
        //     const form = document.getElementById('search__form');
        //     form.addEventListener('submit', (event) => {
        //         event.preventDefault();
        //
        //         const data = {
        //             keyword: event.target.search.value,
        //         };
        //
        //         eventBus.emit(VACANCIES_PAGE_SEARCH, data);
        //     });
        // }

        const allRef = document.querySelectorAll('.orders__order_link');
        allRef.forEach((ref) => {
            ref.addEventListener('click', (e) => {
                e.preventDefault();
                eventBus.emit(GO_TO_VACANCY, ref.getAttribute('name'));
            });
        });

        const allTit = document.querySelectorAll('.orders__order_title');
        allTit.forEach((tit) => {
            tit.addEventListener('click', (e) => {
                eventBus.emit(GO_TO_VACANCY, tit.getAttribute('name'));
            });
        });
    }
}
