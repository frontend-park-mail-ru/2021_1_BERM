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
        const formElement = this.form.querySelector('[name=' + property + ']');
        const errorBox = formElement.parentElement.nextElementSibling;

        formElement.classList.add(type);
        errorBox.innerHTML = error;
        errorBox.style.display = 'block';
    }

    /**
     * Очищение активного элемента
     *
     * @param {string} type - тип (валидность или инвалидность формы)
     * @param {Element} element - активный элемент формы
     *
     */
    clear(type, element) {
        element.classList.remove(type);
    }
}
