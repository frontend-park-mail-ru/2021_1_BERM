import {ValidReflector} from './validReflector.js';
import {ValidHandler} from '@/views/validation/validHandler.js';

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

        this.passwords = Array(document.getElementsByClassName(
            'custom-form__input-mini_in')[0]);
        this.passwords.push(document.getElementsByClassName(
            'custom-form__input-mini_in')[1]);
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
        this._validateForKeyUpField(elements, handler, reflector);
        this._focusField(form, btn, reflector);
        this._validateForBlurField(elements, handler, reflector);
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
                if (property === 'submit' || property === 'rating') return;
                error = handler.getError(formVal, property);

                const elem = document.querySelector(`[name=\'${property}\']`);
                const classElem = elem.getAttribute('class');

                if (!classElem.includes('no-matter')) {
                    if (error.length !== 0) {
                        reflector.show(reflector.invalid, property,
                            error, reflector.click);
                        invalid = true;
                    } else {
                        reflector.show(reflector.valid, property,
                            '', reflector.click);
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
    _validateForKeyUpField(elements, handler, reflector) {
        [].forEach.call(elements, (element) => {
            if (element !== 'submit') {
                element.addEventListener('keyup', (e) => {
                    const formElement = e.target;
                    const property = formElement.getAttribute('name');
                    const dataField = {};

                    if (property.includes('password')) {
                        this.passwords.forEach((item) => {
                            reflector.clear(reflector.invalid, item);
                            reflector.clear(reflector.valid, item);
                            const prop = item.getAttribute('name');
                            dataField[prop] = item.value;
                            const error = handler.getError(dataField, prop);

                            if (error.length &&
                                prop === 'passwordRepeat') {
                                reflector.show(reflector.invalid, prop,
                                    error, '', reflector.pasRep);
                                return;
                            }

                            if (!error.length &&
                                prop === 'passwordRepeat') {
                                reflector.show(reflector.valid, prop,
                                    '', '', reflector.pasRep);
                                return;
                            }

                            if (error.length) {
                                reflector.show(reflector.invalid, prop,
                                    error, '', '');
                                return;
                            }
                            if (!error.length) {
                                reflector.show(reflector.valid, prop,
                                    '', '', '');
                            }
                        });
                    } else {
                        dataField[property] = formElement.value;

                        const error = handler.getError(dataField, property);
                        if (error.length) {
                            reflector.clear(reflector.valid, element);
                            reflector.show(reflector.invalid, property, error,
                                '', '');
                        } else if (!error.length) {
                            reflector.clear(reflector.invalid, element);
                            reflector.show(reflector.valid, property, '',
                                '', '');
                        }
                    }
                    return false;
                });
            }
        });
    }

    _validateForBlurField(elements, handler, reflector) {
        [].forEach.call(elements, (element) => {
            if (element !== 'submit') {
                element.addEventListener('blur', (e) => {
                    const formElement = e.target;
                    const property = formElement.getAttribute('name');
                    const dataField = {};

                    if (property.includes('password')) {
                        this.passwords.forEach((item) => {
                            const prop = item.getAttribute('name');
                            dataField[prop] = item.value;
                            const error = handler.getError(dataField, prop);

                            if (error.length !== 0) {
                                reflector.show(reflector.invalid, prop,
                                    error, reflector.click, '');
                                if (prop === 'passwordRepeat') {
                                    reflector.clear(reflector.helper,
                                        this.passwords[0]);
                                    return;
                                }

                                reflector.clear(reflector.helper, item);
                            }
                        });
                    } else {
                        dataField[property] = formElement.value;
                        const error = handler.getError(dataField, property);

                        if (error.length !== 0) {
                            reflector.show(reflector.invalid, property, error,
                                reflector.click, '');
                        }

                        reflector.clear(reflector.helper, element);
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
    _focusField(form, btn, reflector) {
        form.addEventListener('focus', () => {
            const el = document.activeElement;
            const pasRep = el.getAttribute('name');
            if (pasRep === 'passwordRepeat') {
                reflector.show('', 'password',
                    '', reflector.focus, reflector.pasRep);
                return;
            }
            if (el !== btn) {
                reflector.show('', el.getAttribute('name'),
                    '', reflector.focus, '');
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
