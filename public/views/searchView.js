import {View} from '@/views/view';
import searchTemplate from '@/components/pages/search/search.pug';
import ordersTemplate from '@/components/pages/search/orders.pug';
import vacanciesTemplate from '@/components/pages/search/vacancies.pug';
import suggestTemplate from '@/components/suggest/suggest.pug';
import usersTemplate from '@/components/pages/search/users.pug';
import Select from '@/modules/utils/customSelect';
import {listOfServices} from '@/modules/utils/templatesForSelect';
import eventBus from '@/modules/eventBus';
import {
    GO_TO_ORDER,
    GO_TO_VACANCY,
    SEARCH_GO,
    SEARCH_RENDER_CONTENT, SEARCH_SUGGEST, SEARCH_SUGGEST_RENDER,
    SERVER_ERROR,
} from '@/modules/constants/actions';
import {notification} from '@/components/notification/notification';

/** View страницы поиска */
export class SearchView extends View {
    /**
     * Установка начальных параметров
     *
     * @param {number} key - ключ:
     * 1 - Только заказы
     * 2 - Только вакансии
     * 3 - Только пользователи
     * @param {Object} data - результат
     */
    constructor({key, data}) {
        super();
        this.key = key;
        this.data = data;
    }
    /**
     * Отображение страницы и получение с нее данных
     *
     * @param {boolean} isAuthorized - авторизирован пользователь или нет
     * @param {boolean} isExecutor - это исполнитель или нет
     */
    render(isAuthorized, isExecutor) {
        this.isExecutor = isExecutor;
        super.renderHtml(
            isAuthorized,
            isExecutor,
            'Поиск',
            searchTemplate(),
            [
                [SERVER_ERROR, this._error.bind(this)],
                [SEARCH_RENDER_CONTENT, this._renderContent.bind(this)],
                [SEARCH_SUGGEST_RENDER, this._renderSuggest.bind(this)],
            ],
        );

        if (this.key) {
            this._renderContent({key: this.key, data: this.data});
        }

        const budget = (title) => `
            <div class="filters__budget_no-margin">
                <div class="filters__budget_title">${title}</div>
                <div class="filters__form">
                <input class="filters__form_input" type="number" 
                        placeholder="От" name="salaryFrom" />
                <input class="filters__form_input" type="number" 
                        placeholder="До" name="salaryTo" />
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

        filters.innerHTML = budget('Рейтинг') + sort + category;
        this.selectSort([
            {id: '51', value: 'Рейтингу', type: 'item'},
            {id: '52', value: 'Имени', type: 'item'},
            {id: '53', value: 'Отзывам', type: 'item'},
        ]);
        this.selectCategory();
        this.selectWhat();

        let prev;
        const textarea = document.querySelector('.select__form');
        textarea.addEventListener('select', (event) => {
            const val = event.target.value;
            if (prev === val) return;

            if (val === 'Только заказы' || val === 'Только вакансии') {
                if (prev === 'Только пользователей') {
                    filters.innerHTML = budget('Ставка') + sort + category;
                    this.selectSort();
                    this.selectCategory();
                }
            }

            if (val === 'Только пользователей') {
                filters.innerHTML = budget('Рейтинг') + sort + category;
                this.selectSort([
                    {id: '51', value: 'Рейтингу', type: 'item'},
                    {id: '52', value: 'Имени', type: 'item'},
                    {id: '53', value: 'Отзывам', type: 'item'},
                ]);
                this.selectCategory();
            }

            prev = val;
        });

        const search = document.getElementById('search__form');

        search.addEventListener('submit', (event) => {
            event.preventDefault();
            const data = {
                search_str: event.target.search.value,
            };

            const filters = document.getElementById('filters');
            data.category = filters.category.value === 'Категория' ?
                '' :
                filters.category.value;
            data.desc = filters.desc.value !== 'Возрастанию';
            const sort = filters.sort.value;
            if (sort === 'Заголовку') {
                data.sort = 'title';
            }
            if (sort === 'Заработной плате') {
                data.sort = 'salary';
            }
            if (sort === 'Рейтингу') {
                data.sort = 'rating';
            }
            if (sort === 'Имени') {
                data.sort = 'name';
            }
            if (sort === 'Отзывам') {
                data.sort = 'reviews';
            }
            data.from = filters.salaryFrom.value;
            data.to = filters.salaryTo.value;
            data.what = filters.what.value;
            if (data.what === '') {
                data.what = 'Только пользователей';
            }

            eventBus.emit(SEARCH_GO, data);
        });

        const suggest = document.getElementById('search');
        suggest.addEventListener('input', (event) => {
            const filters = document.getElementById('filters');
            const data = {
                suggest_word: event.target.value,
                what: filters.what.value,
            };
            eventBus.emit(SEARCH_SUGGEST, data);
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
            }, 'dynamic-style',
            'category');
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
            }, 'dynamic-style',
            'desc');

        new Select(
            '#select__sort', {
                placeholder: list[0].value,
                data: list,
            }, 'dynamic-style',
            'sort');
    }

    /**
     * Настройка кастомного селекта выбора области поиска
     */
    selectWhat() {
        new Select(
            '#select__what', {
                placeholder: 'Только пользователей',
                data: this.isExecutor ?
                    [
                        {id: '41', value: 'Только заказы', type: 'item'},
                        {id: '42', value: 'Только вакансии', type: 'item'},
                        {id: '43', value: 'Только пользователей', type: 'item'},
                    ] : [
                        {id: '43', value: 'Только пользователей', type: 'item'},
                    ],
            }, 'dynamic-style',
            'what');
    }

    /**
     * Вывод ошибка
     *
     * @param {String} str
     */
    _error(str) {
        notification(`Ошибка сервера! ${str}`);
    }

    /**
     * Отрисовка контента
     *
     * @param {number} key - ключ:
     * 1 - Только заказы
     * 2 - Только вакансии
     * 3 - Только пользователи
     * @param {Object} data - результат
     */
    _renderContent({key, data}) {
        const content = document.getElementById('content');
        let allRef; let allTit;

        const map = [];
        for (const item of data.values()) {
            map.push(item);
        }

        switch (key) {
        case 1:
            content.innerHTML = ordersTemplate({
                orders: map,
                isExecutor: this.isExecutor,
            });
            allRef = document.querySelectorAll('.orders__order_link');
            allRef.forEach((ref) => {
                ref.addEventListener('click', (e) => {
                    e.preventDefault();
                    eventBus.emit(GO_TO_ORDER, ref.getAttribute('name'));
                });
            });

            allTit = document.querySelectorAll('.orders__order_title');
            allTit.forEach((tit) => {
                tit.addEventListener('click', () => {
                    eventBus.emit(GO_TO_ORDER, tit.getAttribute('name'));
                });
            });
            break;
        case 2:
            content.innerHTML = vacanciesTemplate({
                vacancies: map,
                isExecutor: this.isExecutor,
            });
            allRef = document.querySelectorAll('.vacancies__order_link');
            allRef.forEach((ref) => {
                ref.addEventListener('click', (e) => {
                    e.preventDefault();
                    eventBus.emit(GO_TO_VACANCY, ref.getAttribute('name'));
                });
            });

            allTit = document.querySelectorAll('.vacancies__order_title');
            allTit.forEach((tit) => {
                tit.addEventListener('click', () => {
                    eventBus.emit(GO_TO_VACANCY, tit.getAttribute('name'));
                });
            });
            break;
        case 3:
            content.innerHTML = usersTemplate({
                users: map,
            });
            break;
        }
    }

    /**
     * Отрисовка саджестов
     *
     * @param {Object} data - результат
     */
    _renderSuggest(data) {
        const box = document.getElementById('suggest__bg');

        box.innerHTML = suggestTemplate({
            suggests: data,
        });

        const suggests = document.querySelectorAll('.suggest');
        debugger;

        suggests.forEach((item) => {
            item.addEventListener('click', (event) => {
                const input = document.getElementById('search');
                input.value = event.target.innerText;
                box.innerHTML = '';
            });
        });

        const body = document.querySelector('body');
        body.addEventListener('click', (ev) => {
            box.innerHTML = '';
        });

        box.addEventListener('click', (ev) => {
            ev.stopPropagation();
        });
    }
}
