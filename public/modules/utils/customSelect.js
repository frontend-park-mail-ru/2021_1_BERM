import {getTemplate} from './templatesForSelect.js';

import arrowDown from '@/static/img/Arrow_down.svg';
import arrowUp from '@/static/img/Arrow_up.svg';

/** Класс кастомного селекта*/
export default class Select {
    /**
     * Конструктор
     *
     * @param {string} selector - уникальный номер заказа
     * @param {Object} options - информация отклика
     * @param {string} idSelector
     */
    constructor(selector, options, idSelector) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.selectedId = options.selectedId;
        this.$idSelectorDoc = null;
        this.idSelector = idSelector;

        this.prevStateHeight = 0;
        this.currentStateHeight = 0;
        this.geomKoef = 4;
        this.selectInput = null;
        console.log(this.selectInput);
        // this.selectInput.style.height =


        this.render();
        this.setup();
    }

    /**
     * Рендерем шаблон
     */
    render() {
        const {placeholder, data} = this.options;
        this.$el.classList.add('select');
        this.$el.innerHTML = getTemplate(
            data,
            placeholder,
            this.selectedId,
            this.idSelector);
        this.$idSelectorDoc = document.getElementById(this.idSelector);
    }

    /**
     * Устанавливаем слушатели и ставим нужные селекторы
     */
    setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.$el.addEventListener('click', this.clickHandler);
        this.$arrow = this.$el.querySelector('[data-type="arrow"]');
        this.$value = this.$el.querySelector('[data-type="value"]');

        // this.$value.style.width = this.$value.scrollWidth + 'px';

        this.prevStateHeight = this.$value.scrollHeight;
        this.currentStateHeight = this.$value.scrollHeight;
        this.selectInput = document.querySelector('.select__input');
        console.log(this.selectInput);
    }

    /**
     * Устанавливаем слушатели и ставим нужные селекторы
     *
     * @param {Event} event - событие на клик
     */
    clickHandler(event) {
        const {type} = event.target.dataset;

        if (type === 'input' || type === 'arrow' || type === 'value') {
            this.toggle();
        } else if (type === 'item') {
            const id = event.target.dataset.id;
            this.select(id);
        } else if (type === 'backdrop') {
            this.close();
        }
    }

    /**
     * Проверка на то открыт ли селект
     *
     * @return {boolean}
     */
    get isOpen() {
        return this.$el.classList.contains('open');
    }

    /**
     * Проверка на текущий это объект или нет
     *
     * @return {string}
     */
    get current() {
        return this.options.data.find((item) => item.id === this.selectedId);
    }

    /**
     * Выбираем элемент
     *
     * @param {number} id
     */
    select(id) {
        // const selectInput = this.$value.parentNode;

        console.log(this.currentStateHeight, this.prevStateHeight);
        // console.log( this.$value.scrollHeight);
        console.log('_______________________AAAA');
        console.log(this.$value.scrollHeight);
        console.log(this.$value.clientHeight);
        console.log(this.$value.offsetHeight);
        console.log('_______________________AAAA');

        this.selectedId = id;
        this.$value.style.height = '60px';
        this.$value.value = this.current.value;
        console.log('_______________________AAAA');
        console.log(this.$value.scrollHeight);
        console.log(this.$value.clientHeight);
        console.log(this.$value.offsetHeight);
        console.log('_______________________AAAA');
        const scrollHeight = this.$value.scrollHeight;
        this.$value.style.height = scrollHeight - 4 + 'px';
        this.selectInput.style.height = scrollHeight + 2 + 'px';

        console.log( this.$value.scrollHeight);
        this.$el.querySelectorAll('[data-type="item"]').forEach((el) => {
            el.classList.remove('selected');
        });
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected');

        this.close();
    }

    /**
     * Смотрим открыт ли селект или нет
     *
     */
    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    /**
     * Открываем селект
     *
     */
    open() {
        this.$idSelectorDoc.style.borderRadius = '8px 8px 0 0px';
        this.$el.classList.add('open');
        this.$arrow.src = arrowUp;
    }

    /**
     * закрываем селект
     *
     */
    close() {
        this.$idSelectorDoc.style.borderRadius = '8px';
        this.$el.classList.remove('open');
        this.$arrow.src = arrowDown;
    }

    /**
     * Уничтожаем Листенера
     *
     */
    destroy() {
        this.$el.removeEventListener('click', this.clickHandler);
        this.$el.innerHTML = '';
    }
}


