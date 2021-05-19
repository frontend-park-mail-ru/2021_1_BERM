import {View} from '@/views/view';
import searchTemplate from '@/components/pages/search/search.pug';
import Select from '@/modules/utils/customSelect';
import {listOfServices} from '@/modules/utils/templatesForSelect';

/** View страницы поиска */
export class SearchView extends View {
    /**
     * Отображение страницы и получение с нее данных
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        super.renderHtml(
            isAuthorized,
            isExecutor,
            'Поиск',
            searchTemplate(),
            [],
        );

        const budget = `
            <div class="filters__budget_no-margin">
                <div class="filters__budget_title">Ставка</div>
                <div class="filters__form">
                <input class="filters__form_input" type="text" 
                        placeholder="От" name="salary" />
                <input class="filters__form_input" type="text" 
                        placeholder="До" name="salary" />
                </div>
            </div>
        `;

        const sort = `
            <div class="filters__elem"><label>Сортировать по</label>
                <div class="settings-form__input-mini_bg">
                    <div id="select__sort"></div>
                </div>
            </div>
            <div class="filters__elem">
                <div class="settings-form__input-mini_bg">
                    <div id="select__sort_duration"></div>
                </div>
            </div>
        `;

        const category = `
            <div class="filters__elem"><label>Выбрать категорию</label>
                <div class="settings-form__input-mini_bg">
                    <div id="select"></div>
                </div>
            </div>
        `;

        const filters = document.querySelector('.filters__content');

        debugger;

        filters.innerHTML = budget + sort + category;

        this.selectConfig();

        const textarea = document.querySelector('.select__form');
        textarea.addEventListener('select', (event) => {
            const val = event.target.value;
            debugger;
            if (val === 'Только заказы') {
                filters.innerHTML = budget + sort + category;
            }
            if (val === 'Только вакансии') {
                filters.innerHTML = category;
            }
            if (val === 'Только пользователей') {
                filters.innerHTML = sort;
            }
        });
    }


    selectConfig() {
        new Select(
            '#select', {
                placeholder: 'Категория',
                data: listOfServices,
            }, 'dynamic-style');

        new Select(
            '#select__what', {
                placeholder: 'Только заказы',
                data: [
                    {id: '41', value: 'Только заказы', type: 'item'},
                    {id: '42', value: 'Только вакансии', type: 'item'},
                    {id: '43', value: 'Только пользователей', type: 'item'},
                ],
            }, 'dynamic-style');

        new Select(
            '#select__sort_duration', {
                placeholder: 'Уменьшению',
                data: [
                    {id: '51', value: 'Уменьшению', type: 'item'},
                    {id: '52', value: 'Возрастанию', type: 'item'},
                ],
            }, 'dynamic-style');

        new Select(
            '#select__sort', {
                placeholder: 'Заголовку',
                data: [
                    {id: '61', value: 'Заголовку', type: 'item'},
                    {id: '62', value: 'Заработной плате', type: 'item'},
                ],
            }, 'dynamic-style');
    }
}
