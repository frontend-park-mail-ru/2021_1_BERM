import {View} from './view.js';
import {Validator} from './validator.js'
import eventBus from "../modules/eventBus.js";

import orderpageTemplate from "@/templates/orderPage.pug"

export class OrderView extends View {
    render() {
        super.renderHtml(
            orderpageTemplate(),
            [
                ['no-order', this._onNoOrder],
            ]);

        let val = new Validator('feedback', '.form-control', 'send_mess');
        val.validate();

        const form = document.getElementById('feedback');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                order_name: event.target.order_name.value,
                specialize: "Косяки апишки", // Todo user.first_name + " " + user.second_name
                description: event.target.description.value,
                budget: event.target.budget.value,
                deadline: 1617004533, // ToDo сделать в форме дедлайн заказа
            };

            eventBus.emit('order-submit', data);
        });
    }

    _onNoOrder() {
        // ToDo не удалось разместить заказ
        console.log('ToDo не удалось разместить заказ');
    }
}

