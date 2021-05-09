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

        this.$value.style.width = this.$value.scrollWidth + 'px';
    }

    /**
     * Устанавливаем слушатели и ставим нужные селекторы
     *
     * @param {Event} event - событие на клик
     */
    clickHandler(event) {
        const {type} = event.target.dataset;

        if (type === 'input' || type === 'arrow') {
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
    isOpen() {
        return this.$el.classList.contains('open');
    }

    /**
     * Проверка на текущий это объект или нет
     *
     * @return {string}
     */
    current() {
        return this.options.data.find((item) => item.id === this.selectedId);
    }

    /**
     * Выбираем элемент
     *
     * @param {number} id
     */
    select(id) {
        this.selectedId = id;
        this.$value.style.width = '0';
        this.$value.value = this.current.value;
        this.$value.style.width = this.$value.scrollWidth + 'px';

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


