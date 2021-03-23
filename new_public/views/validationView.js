import {ValidReflector} from './utils/validReflector.js';
import {ValidHandler} from '../modules/validation/validHandler.js';

export class ValidationView {
    constructor() {
        // this.validator = Validator
    }

    validate() {

        let form = document.getElementById('feedback');
        if (!form) return; // ToDo реализовать обработку ошибки
        let reflector = new ValidReflector(form);
        let handler = new ValidHandler();

        let elements = form.querySelectorAll('.form-control'),
            btn = document.getElementById('send_mess'),
            iserror = false;

        btn.addEventListener('click', (e) => {
            let formVal = this.getFormData(form),
                error;

            let invalid = false;
            iserror = false;
            for (let property in formVal) {
                if (property === 'submit') continue;
                //error = getError(formVal, property);
                error = handler.getError(formVal, property);

                if (error.length !== 0) {
                    // iserror = true;
                   // showError(property, error);
                    reflector.show(reflector.invalid, property, error);
                    invalid = true;
                } else if (error.length === 0) {
                   // showValid(property)
                    reflector.show(reflector.valid, property, '');

                }
            }

            if (invalid === true) {
                iserror = true;
            }

            if (iserror) {
                e.preventDefault();
            }

            return false;
        }, );

        form.addEventListener('focus',  () => {
            let el = document.activeElement;
            if (el !== btn) {
                // cleanError(el);
                reflector.clear(reflector.invalid, el);
                // cleanValid(el);
                reflector.clear(reflector.valid, el);
            }
        }, true);

        [].forEach.call(elements,  (element) => {
            if (element !== 'submit') {element.addEventListener('blur',  (e) => {
                let formElement = e.target,
                    property = formElement.getAttribute('name'),
                    dataField = {};

                dataField[property] = formElement.value;

                let error = handler.getError(dataField, property);
                if (error.length !== 0) {
                    reflector.show(reflector.invalid, property, error);
                } else if (error.length === 0) {
                    reflector.show(reflector.valid, property, '');
                }
                return false;
            });}

        });

    }

    getFormData(form){
        let controls = {};
        if (!form.elements) return '';
        for (let i = 0, ln = form.elements.length; i < ln; i++) {
            let element = form.elements[i];
            if (element.tagName.toLowerCase() !== 'button') {
                controls[element.name] = element.value;
            }
        }
        return controls;
    }

}