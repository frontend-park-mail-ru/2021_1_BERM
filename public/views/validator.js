import {ValidReflector} from './utils/validReflector.js';
import {ValidHandler} from '@/modules/utils/validHandler.js';

/** Класс, отвечающий за валидацию форм */
export class Validator {
    /**
     * Конструктор
     * @param {string} formIdName - название формы
     * @param {string} selectorName - селектор
     * @param {string} buttonIdName - кнопка
     */
    constructor(formIdName, selectorName, buttonIdName) {
        this.formIdName = formIdName;
        this.selectorName = selectorName;
        this.buttonIdName = buttonIdName;
    }


    /**
     * Запускает процесс валидации
     */
    validate() {
        const form = document.getElementById(this.formIdName);
        if (!form) return;
        const reflector = new ValidReflector(form);
        const handler = new ValidHandler();
        const elements = form.querySelectorAll(this.selectorName);
        const btn = document.getElementById(this.buttonIdName);

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
            const formVal = this._getFormData(form);
            let error;
            let isError = false;
            let invalid = false;

            Object.keys(formVal).forEach((property) => {
                if (property === 'submit') return;
                error = handler.getError(formVal, property);

                const elem = document.querySelector(`[name=\'${property}\']`);
                const classElem = elem.getAttribute('class');

                if (!classElem.includes('no-matter')) {
                    if (error.length !== 0) {
                        reflector.show(reflector.invalid, property, error);
                        invalid = true;
                    } else {
                        reflector.show(reflector.valid, property, '');
                    }
                }
            });

            if (invalid === true) {
                isError = true;
            }

            if (isError) {
                e.preventDefault();
            }

            return false;
        } );
    }

    /**
     * Валидации при "отпускании" поля страницы
     *
     * @param {NodeListOf<any>} elements - элементы формы
     * @param {ValidHandler} handler - обработчик полей валидации
     * @param {ValidReflector} reflector - отображатель валидации на странице
     */
    _validateForFocusField(elements, handler, reflector) {
        [].forEach.call(elements, (element) => {
            if (element !== 'submit') {
                element.addEventListener('blur', (e) => {
                    const formElement = e.target;
                    const property = formElement.getAttribute('name');
                    const dataField = {};

                    if (property.includes('password')) {
                        const passwords = Array(document.getElementsByClassName(
                            'custom-form__input-mini_in')[0]);
                        passwords.push(document.getElementsByClassName(
                            'custom-form__input-mini_in')[1]);

                        passwords.forEach((item) => {
                            reflector.clear(reflector.invalid, item);
                            reflector.clear(reflector.valid, item);
                            const prop = item.getAttribute('name');

                            dataField[prop] = item.value;

                            const error = handler.getError(dataField, prop);

                            if (error.length !== 0) {
                                reflector.show(reflector.invalid, prop, error);
                            } else if (error.length === 0) {
                                reflector.show(reflector.valid, prop, '');
                            }
                        });
                    } else {
                        dataField[property] = formElement.value;

                        const error = handler.getError(dataField, property);
                        if (error.length !== 0) {
                            reflector.show(reflector.invalid, property, error);
                        } else if (error.length === 0) {
                            reflector.show(reflector.valid, property, '');
                        }
                    }
                    return false;
                });
            }
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
        form.addEventListener('focus', () => {
            const el = document.activeElement;
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
     * @return {Object}
     */
    _getFormData(form) {
        const controls = {};
        if (!form.elements) return '';
        for (let i = 0, ln = form.elements.length; i < ln; i++) {
            const element = form.elements[i];
            if (element.tagName.toLowerCase() !== 'button') {
                controls[element.name] = element.value;
            }
        }
        return controls;
    }
}
