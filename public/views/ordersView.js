import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import {
    GET_ORDERS,
    SEND_SERVICES,
    SEND_RESULT_RENDER,
    ORDERS_RENDER,
} from "@/modules/utils/actions";
import ordersTemplate from "@/templates/orders.pug";
import clientRegTemplate from "@/templates/clientReg.pug";

var tempData = {
    orders: [{
        avatar: '',
        login: 'sa',
        title: 'dasdas',
        categore: 'asdasd',
        definition: 'asdasd',
        date: '100000',
        budget: '500'
    },
        {
            avatar: '',
            login: 'saadsdsadsa',
            title: 'dasdas213123123',
            categore: 'asdasd1312321',
            definition: 'asdasd',
            date: '100000',
            budget: '500'
        },
        {
            avatar: '',
            login: 'sa',
            title: 'dasdas',
            categore: 'asdasd',
            definition: 'asdasd',
            date: '100000',
            budget: '500'
        }],
}

export class OrdersView extends View {
    render(isAuthorized) {
        super.setListeners([
            [ORDERS_RENDER, this._renderData],
        ]);
        eventBus.emit(SEND_SERVICES);
    }

    _renderData(data) {
        super.renderHtml(
            data.isAuthorized,
            'Настройки',
            ordersTemplate(tempData),
            // avatar, login, title, category, definition, date, budget
        );
    }

}