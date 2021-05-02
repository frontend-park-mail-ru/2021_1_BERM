import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import {
    SEND_SERVICES_VACANCIES,
    VACANCIES_RENDER,
    GO_TO_VACANCY,
} from '@/modules/utils/actions';
import ordersTemplate from '@/components/pages/vacancies.pug';

export class VacanciesView extends View {
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [VACANCIES_RENDER, this._renderDataVacancies],
        ]);
        eventBus.emit(SEND_SERVICES_VACANCIES);
    }

    _renderDataVacancies(dataMap) {
        const map = [];
        for (const item of dataMap.map.values()) {
            map.push(item);
        }
        console.log(map);

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
