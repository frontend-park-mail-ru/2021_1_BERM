import {View} from './view.js';
import eventBus from '../modules/eventBus.js';
import {
    GET_ORDERS,
    SEND_SERVICES,
    SEND_RESULT_RENDER,
    ORDERS_RENDER,
} from "@/modules/utils/actions";
import settingsTemplate from "@/templates/settings.pug";

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
            orders(data),
        );
    }

}