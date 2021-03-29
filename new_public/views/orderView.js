import {View} from './view.js';
import {Validator} from './validator.js'
import eventBus from "../modules/eventBus.js";

export class OrderView extends View {
    render() {
        super.renderHtml(
            orderpageTemplate(),
            [
                ['no-set-up', this._onNoRegistration],
            ]);

        let val = new Validator('feedback', '.form-control', 'send_mess');
        val.validate();

        const form = document.getElementById('feedback');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                order_name: event.target.order_name,
                specialize: event.target.specialize,
                description: event.target.description,
                budget: event.target.budget,
                deadline: 1617004533, // ToDo сделать в форме дедлайн заказа
            };

            eventBus.emit('order-submit', data);
        });
    }

    _onNoRegistration() {
        // ToDo такой email уже существует
        console.log('bizarro');
    }
}

