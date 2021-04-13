import selectSpec from '@/components/pages/selectSpec.pug';
import {View} from './view.js';
import Select from '../modules/utils/customSelect.js';
import {listOfServices} from '../modules/utils/templatesForSelect.js';
import eventBus from '../modules/eventBus.js';
import {SELECT_SPEC_SELECTED} from '../modules/utils/actions.js';
import {Validator} from './validator';

export class SelectSpecView extends View {
    render(isAuthorized, isExecutor) {
        super.renderHtml(
            isAuthorized,
            isExecutor,
            'Выбор специализации',
            selectSpec(),
            [],
        );

        new Select(
            '#select', {
                placeholder: 'Категория',
                data: listOfServices,
            }, 'dynamic-style');

        const val = new Validator(
            'specForm',
            '.form-control',
            'send_mess',
        );
        val.validate();

        const form = document.getElementById('specForm');

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const data = {
                spec: event.target.category.value,
            };

            eventBus.emit(SELECT_SPEC_SELECTED, data);
        });
    }
}
