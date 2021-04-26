/** Класс обработчика даты */
export default class DateHandler {
    /** Конструктор */
    constructor() {
        this.actions = {
            WRITING: true,
            DELETING: false,
        };
        this.dotes = {
            day: 2,
            mouth: 5,
        };
        this.lengths = [0];
    }

    /** Создание даты */
    createDate() {
        const regex = /[-;":'a-zA-Zа-яА-Я]/;
        let action = this.actions.WRITING;
        const date = document.getElementById('date');
        date.setAttribute('maxlength', '10');
        date.addEventListener('input', (e) => {
            date.value = date.value.replace(regex, '');
            action = this.lengthHandler(e);
            this.inputHandler(e, action);
        });
    }

    /**
     * Обработчик поля ввода
     *
     * @param {$ElementType} e
     * @param {boolean} action
     */
    inputHandler(e, action) {
        if (e.target.value.length === this.dotes.day && action === true ||
        e.target.value.length === this.dotes.mouth && action === true) {
            e.target.value += '.';
        }
        if (e.target.value.length === this.dotes.day && action === false) {
            e.target.value = e.target.value.slice(0, 1);
        }

        if (e.target.value.length === this.dotes.mouth && action === false) {
            e.target.value = e.target.value.slice(0, 4);
        }
        this.lengthHandler(e);
    }

    /**
     * Обработчик длины
     *
     * @param {$ElementType} e
     *
     * @return {Object}
     */
    lengthHandler(e) {
        if (this.lengths.length < 2) {
            this.lengths.push(e.target.value.length);
        } else {
            this.lengths[0] = this.lengths[1];
            this.lengths[1] = e.target.value.length;
        }

        if (this.lengths[0] >= this.lengths[1]) {
            return this.actions.DELETING;
        } else {
            return this.actions.WRITING;
        }
    }
}
