import {getTemplate} from './templatesForSelect.js';

import arrowDown from '@/static/img/Arrow_down.svg';
import arrowUp from '@/static/img/Arrow_up.svg';

export default class Select {
    constructor(selector, options, idSelector) {
        this.$el = document.querySelector(selector);
        this.options = options;
        this.selectedId = options.selectedId;
        this.$idSelectorDoc = null;
        this.idSelector = idSelector;

        this.render();
        this.setup();
    }

    render() {
        const {placeholder, data} = this.options;
        this.$el.classList.add('select');
        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId, this.idSelector);
        this.$idSelectorDoc = document.getElementById(this.idSelector);
    }

    setup() {
        this.clickHandler = this.clickHandler.bind(this);
        this.$el.addEventListener('click', this.clickHandler);
        this.$arrow = this.$el.querySelector('[data-type="arrow"]');
        this.$value = this.$el.querySelector('[data-type="value"]');
    }

    clickHandler(event) {
        const {type} = event.target.dataset;
        console.log(event.target.dataset);

        if (type !== undefined ) {
            console.log(type.type);
        }

        if (type === 'input' || type === 'arrow') {
            this.toggle();
        } else if (type === 'item') {
            const id = event.target.dataset.id;
            this.select(id);
        } else if (type === 'backdrop') {
            this.close();
        }
    }

    get isOpen() {
        return this.$el.classList.contains('open');
    }

    get current() {
        return this.options.data.find((item) => item.id === this.selectedId);
    }

    select(id) {
        this.selectedId = id;
        this.$value.textContent = this.current.value;

        this.$el.querySelectorAll('[data-type="item"]').forEach((el) => {
            el.classList.remove('selected');
        });
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected');

        this.close();
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    // Icons/Arrow_down.svg
    open() {
        this.$idSelectorDoc.style.borderRadius = '8px 8px 0 0px';
        this.$el.classList.add('open');
        // this.$arrow.classList.remove('fa-chevron-down');
        // this.$arrow.classList.add('fa-chevron-up');
        this.$arrow.src = arrowUp;
    }

    close() {
        this.$idSelectorDoc.style.borderRadius = '8px';
        this.$el.classList.remove('open');
        // this.$arrow.classList.add('fa-chevron-down');
        // this.$arrow.classList.remove('fa-chevron-up');
        this.$arrow.src = arrowDown;
    }

    destroy() {
        this.$el.removeEventListener('click', this.clickHandler);
        this.$el.innerHTML = '';
    }
}
