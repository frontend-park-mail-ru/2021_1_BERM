import options from '@/modules/utils/validOptions';
/** Класс, отвечающий за отображение валидации на странице */
export class ValidReflector {
    /**
     * Конструктор
     * @param {HTMLElement} form - результат запроса
     */
    constructor(form) {
        this.form = form;
        this.valid = 'form-control_valid';
        this.invalid = 'form-control_error';
        this.active = 'error__main_active';
        this.helper = 'help';
        this.pasRep = 'pasRep';

        this.focus = 'focus';
        this.click = 'click';

        this.pasRepValid = false;
        this.textAr = document.getElementById('textAr');

        this._setUp();
    }

    _setUp() {
        const pasArrow = document.getElementById('arrow__password');

        if (pasArrow) {
            pasArrow.style.transform = 'translateX(0)';
        }

        if (this.textAr) {
            this.textAr.style.transform = 'translateY(-275px)';
            this.textAr.childNodes[1].style.transform = 'translateX(-135px)';
        }
    }

    /**
     * Отображение валидности или инвалидности формы
     *
     * @param {string} type - тип (валидность или инвалидность формы)
     * @param {string} property - название поля
     * @param {string} error - текст ошибки,
     * в случае, когда форма валидна, передается пустая строка
     *
     */
    show(type, property, error, event, options) {
        const formElement = this.form
            .querySelector('[name=' + property + ']').parentNode;
        const errorBox = formElement.nextElementSibling.childNodes[1];
        const errorMes = formElement.nextElementSibling.firstChild;
        if (type === this.valid && property === options.passwordRepeat) {
            this.pasRepValid = true;
        }

        if (type === this.invalid && property === options.passwordRepeat) {
            this.pasRepValid = false;
        }

        if ((property === options.about || property === options.des) && error) {
            this.textAr.style.transform = 'translateY(-290px)';
        }

        if (type) {
            formElement.classList.add(type);
        }

        if (options === this.pasRep) {
            if (errorBox.classList.contains(this.active) ||
            type === this.valid) {
                return;
            }
            if (!this.pasRepValid) {
                const formElement1 = this.form
                    .querySelector('[name=' + 'password' + ']').parentNode;
                const errorBox1 = formElement1.nextElementSibling.childNodes[1];
                errorBox1.classList.add(this.active);
            }

            if (event !== this.focus && error) {
                errorMes.innerHTML = error;
            }
            return;
        }

        if (event === this.focus &&
            formElement.classList.contains(this.valid)) {
            return;
        }


        if (event === this.focus &&
            !errorBox.classList.contains(this.active)) {
            errorBox.classList.add(this.active);
            return;
        }


        if (event === this.click) {
            if (error) {
                errorMes.innerHTML = error;
            }
            return;
        }


        // formElement.classList.add(type);

        if (error) {
            errorMes.innerHTML = error;
            if (!errorBox.classList.contains(this.active)) {
                errorBox.classList.add(this.active);
            }
        }
    }

    /**
     * Очищение активного элемента
     *
     * @param {string} type - тип (валидность или инвалидность формы)
     * @param {Element} element - активный элемент формы
     *
     */
    clear(type, element) {
        const el = element.parentNode;
        const errorMes = el.nextElementSibling.firstChild;
        const errorBox = el.nextElementSibling.childNodes[1];

        if (type === this.helper) {
            if (errorBox.classList.contains(this.active)) {
                errorBox.classList.remove(this.active);
            }
            return;
        }

        if (el.classList.contains(type)) {
            el.classList.remove(type);
        }

        if (this.valid) {
            errorMes.innerHTML = ' ';
            errorBox.classList.remove(this.active);
        }

        // errorBox.style.marginBottom = '0';
        // errorBox.style.marginTop = '0';
    }
}
