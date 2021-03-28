 export class ValidReflector {
    constructor(form) {
        this.form = form;
        this.valid = 'form-control_valid';
        this.invalid = 'form-control_error';
    }

    show(type, property, error) {
        let formElement = this.form.querySelector('[name=' + property + ']')
        let errorBox = formElement.parentElement.nextElementSibling;

        formElement.classList.add(type);
        errorBox.innerHTML = error;
        errorBox.style.display = 'block';
    }

    clear(type, element) {
        element.classList.remove(type);
    }

}
