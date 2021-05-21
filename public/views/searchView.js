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

        const budget = (title) => `
            <div class="filters__budget_no-margin">
                <div class="filters__budget_title">${title}</div>
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

        filters.innerHTML = budget('Ставка') + sort + category;

        this.selectCategory();
        this.selectSort();
        this.selectWhat();

        const textarea = document.querySelector('.select__form');
        textarea.addEventListener('select', (event) => {
            const val = event.target.value;
            if (val === 'Только заказы' || val === 'Только вакансии') {
                filters.innerHTML = budget('Ставка') + sort + category;
                this.selectSort();
            }

            if (val === 'Только пользователей') {
                filters.innerHTML = budget('Рейтинг') + sort + category;
                this.selectSort([
                    {id: '51', value: 'Рейтингу', type: 'item'},
                    {id: '52', value: 'Имени', type: 'item'},
                ]);
            }

            this.selectCategory();
        });
    }

    /**
     * Настройка кастомного селекта категорий
     */
    selectCategory() {
        new Select(
            '#select', {
                placeholder: 'Категория',
                data: listOfServices,
            }, 'dynamic-style');
    }

    /**
     * Настройка кастомного селекта сортировки
     *
     * @param {array} list
     */
    selectSort(list = [
        {id: '61', value: 'Заголовку', type: 'item'},
        {id: '62', value: 'Заработной плате', type: 'item'},
    ]) {
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
                placeholder: list[0].value,
                data: list,
            }, 'dynamic-style');
    }

    /**
     * Настройка кастомного селекта выбора области поиска
     */
    selectWhat() {
        new Select(
            '#select__what', {
                placeholder: 'Только заказы',
                data: [
                    {id: '41', value: 'Только заказы', type: 'item'},
                    {id: '42', value: 'Только вакансии', type: 'item'},
                    {id: '43', value: 'Только пользователей', type: 'item'},
                ],
            }, 'dynamic-style');
    }
}
