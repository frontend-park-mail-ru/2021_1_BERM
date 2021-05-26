/** Класс для обработки численных полей */
export default class PriceHandler {
    /**
     * Конструктор
     *
     * @param {string} nameField - имя поле
     */
    constructor(nameField) {
        this.selector = nameField;
    }

    /**
     * Запуск
     */
    start() {
        const field = document.getElementsByName(this.selector)[0];
        const regNumber =/(\D)/g;
        field.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(regNumber, '').
                substr(0, 10);
        });
    }
}
