import {ValidReflector} from './utils/validReflector.js';
import {ValidHandler} from '../modules/utils/validHandler.js';

export class Validator {
    constructor(formIdName, selectorName, buttonIdName, preParam) {
            this.formIdName = formIdName;
            this.selectorName = selectorName;
            this.buttonIdName = buttonIdName;
            this.preParam = preParam;
    }


    /**
     * Запускает процесс валидации
     */
    validate() {
        const form = document.getElementById(this.formIdName);
        if (!form) return; // ToDo реализовать обработку ошибки
        let reflector = new ValidReflector(form);
        let handler = new ValidHandler();

        let elements = form.querySelectorAll(this.selectorName),
            btn = document.getElementById(this.buttonIdName);

        if (this.preParam !== undefined) {
            this._preValid(this.preParam);
        }


        this._validateForButtonClick(form, btn, handler, reflector);
        this._validateForFocusField(elements, handler, reflector);
        this._clearField(form, btn, reflector);

    }

    /**
     * Валидации при срабатывании нажатия кнопки
     *
     * @param {HTMLElement} form - форма
     * @param {HTMLElement} btn - кнопка
     * @param {ValidHandler} handler - обработчик полей валидации
     * @param {ValidReflector} reflector - отображатель валидации на странице
     */
    _validateForButtonClick(form, btn, handler, reflector) {
        btn.addEventListener('click', (e) => {
            let formVal = this._getFormData(form),
                error,
                isError = false,
                invalid = false;

            for (let property in formVal) {
                if (property === 'submit') continue;
                error = handler.getError(formVal, property);

                if (error.length !== 0) {
                    reflector.show(reflector.invalid, property, error);
                    invalid = true;
                } else if (error.length === 0) {
                    reflector.show(reflector.valid, property, '');
                }
            }

            if (invalid === true) {
                isError = true;
            }

            if (isError) {
                e.preventDefault();
            }

            return false;
        }, );
    }

    /**
     * Валидации при "отпускании" поля страницы
     *
     * @param {NodeListOf<any>} elements - элементы формы
     * @param {ValidHandler} handler - обработчик полей валидации
     * @param {ValidReflector} reflector - отображатель валидации на странице
     */

    _validateForFocusField(elements, handler, reflector) {
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

    /**
     * Очистка поля формы при нажатии на него
     *
     * @param {HTMLElement} form - форма
     * @param {HTMLElement} btn - кнопка
     * @param {ValidReflector} reflector - отображатель валидации на странице
     */

    _clearField(form, btn, reflector) {
        form.addEventListener('focus',  () => {
            let el = document.activeElement;
            if (el !== btn) {
                reflector.clear(reflector.invalid, el);
                reflector.clear(reflector.valid, el);
            }
        }, true);
    }

    /**
     * Получения данных с формы
     *
     * @param {HTMLElement} form - форма
     * @returns {Object}
     */

    _getFormData(form){
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

    _preValid(preParam) {
        // ToDo реализовать отображение параметров при плохом ответе с бека
        console.log(preParam);
    }

}