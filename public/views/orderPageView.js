import {View} from './view.js';
import {
    ORDER_PAGE_RENDER,
    ORDER_PAGE_GET_RES,
} from '../modules/utils/actions.js';
import eventBus from '../modules/eventBus.js';

import orderPageTemplate from '@/components/pages/orderPageExecutor.pug';

export class OrderPageView extends View {
    render(isAuthorized, isExecutor) {
        super.setListeners([
            [ORDER_PAGE_RENDER, this._orderPageRender],
        ]);

        eventBus.emit(ORDER_PAGE_GET_RES);
    }

    _orderPageRender(info) {
        super.renderHtml(
            info.isAuthorized,
            info.isExecutor,
            'Страница заказа',
            orderPageTemplate({
                creator: { // создатель заказа
                    avatar: '',
                    title: 'Хочу хачапури',
                    category: 'Бизарро',
                    definition: 'Ага',
                    date: 'угу',
                },
                userResponsed: [{
                    avatar: '',
                    login: 'xuy',
                    rate: '0',
                    date: '09.008.22',
                },
                {
                    avatar: '',
                    login: 'xuy',
                    rate: '0',
                    date: '09.008.22',
                },
                {
                    avatar: '',
                    login: 'xuy',
                    rate: '0',
                    date: '09.008.22',
                },
                ],
                userMinResponse: { // минимальный отклик по ставке
                    name: '123',
                    rate: '12',
                    date: '1',
                },
                userRate: '1488', // отклик текущего пользователя, если его сейчас нет - передавать  0 !!!!1
            }),
        );
    }

    // ToDo Тут навешиваем обработчики и вызываем события

    // Todo Если нажали на один из откликов
}
