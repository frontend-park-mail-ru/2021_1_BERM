export default class PriceHandler {
    constructor(nameField) {
        this.selector = nameField;
    }

    start() {
        const field = document.getElementsByName(this.selector)[0];
        const regNumber =/(\D)/g;
        field.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(regNumber, '').
                substr(0, 10);
        });
    }
}
