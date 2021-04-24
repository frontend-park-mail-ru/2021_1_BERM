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
        this.helper = 'help';

        this.focus = 'focus';
        this.click = 'click';
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
    show(type, property, error, event) {
        const formElement = this.form
            .querySelector('[name=' + property + ']').parentNode;
        const errorBox = formElement.nextElementSibling.childNodes[1];

        if (event === this.focus &&
            formElement.classList.contains(this.valid)) {
            return;
        }

        if (event === this.focus) {
            errorBox.classList.add('error__main_active');
            return;
        }
        const errorMes = formElement.nextElementSibling.firstChild;
        formElement.classList.add(type);

        if (event === this.click) {
            if (error) {
                errorMes.innerHTML = error;
            }
            return;
        }


        // formElement.classList.add(type);

        if (error) {
            errorMes.innerHTML = error;
            errorBox.classList.add('error__main_active');
            // errorMes.style.display = 'block';
            // errorMes.style.marginBottom = '-21px';
            // errorMes.style.marginTop = '2px';
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
            if (errorBox.classList.contains('error__main_active')) {
                errorBox.classList.remove('error__main_active');
            }
            return;
        }

        if (el.classList.contains(type)) {
            el.classList.remove(type);
        }

        errorMes.innerHTML = ' ';
        errorBox.classList.remove('error__main_active');
        // errorBox.style.marginBottom = '0';
        // errorBox.style.marginTop = '0';
    }
}
