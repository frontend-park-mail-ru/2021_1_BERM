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
    show(type, property, error) {
        const formElement = this.form
            .querySelector('[name=' + property + ']').parentNode;
        // const errorBox = formElement.parentElement.nextElementSibling;
        const errorBox = formElement.nextElementSibling;

        // formElement.classList.add(type);
        formElement.classList.add(type);
        if (error) {
            errorBox.innerHTML = error;
            errorBox.style.display = 'block';
            errorBox.style.marginBottom = '-21px';
            errorBox.style.marginTop = '2px';
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
        // element.classList.remove(type);
        // console.log();
        // element.classList.remove(type);
        // element.innerHTML = ' ';
        const el = element.parentNode;
        el.classList.remove(type);
        const errorBox = el.nextElementSibling;
        errorBox.innerHTML = ' ';
        errorBox.style.marginBottom = '0';
        errorBox.style.marginTop = '0';
    }
}
