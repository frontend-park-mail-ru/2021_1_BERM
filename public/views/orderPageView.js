import {View} from './view.js';
import {
    ORDER_PAGE_RENDER,
    ORDER_PAGE_GET_RES,
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';

export class OrderPageView extends View {
    render(isAuthorized) {
        this.isAuth = isAuthorized;
        super.setListeners([
            [ORDER_PAGE_RENDER, this._orderPageRender],
        ]);

        eventBus.emit(ORDER_PAGE_GET_RES);
    }

    _orderPageRender(info) {
        super.renderHtml(
            this.isAuth,
            'Страница заказа',
            // ToDo: Отправляем template страницы с информацией:
            //  orderpageTemplate(info)
        );
    }
    // ToDo Тут навешиваем обработчики и вызываем события

    // Todo Если нажали на один из откликов
}
