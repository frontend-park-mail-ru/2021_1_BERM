import Utils from './utils.js';

/** Класс для обработки ошибок */
export class ValidHandler {
    /**
     * Конструктор
     */
    constructor() {
        this.errors = Utils.getAllErrors();
        this.patterns = Utils.getAllPatterns();
        this.password = '';
    }

    /**
     * Обработка соответствующего поля
     *
     * @param {Object} formVal - значения формы
     * @param {string} property - кнопка
     *
     * @return {string} error - сообщение о ошибке
     */
    getError(formVal, property) {
        const validate = {
            login: () => {
                if (formVal.login.length === 0 ||
                    this.patterns
                        .get('user_name')
                        .test(formVal.login) === false) {
                    return this.errors[7];
                }
            },
            email: () => {
                if (formVal.email.length === 0) {
                    return this.errors[2];
                } else if (this.patterns
                    .get('mail')
                    .test(formVal.email) === false) {
                    return this.errors[3];
                }
            },
            order_name: () => {
                if (formVal.order_name.length === 0) {
                    return this.errors[4];
                } else if (this.patterns
                    .get('spam')
                    .test(formVal.order_name) === false) {
                    return this.errors[6];
                }
            },
            about: () => {
                if (formVal.about.length === 0) {
                    return this.errors[5];
                } else if (this.patterns
                    .get('spam')
                    .test(formVal.about) === false) {
                    return this.errors[6];
                }
            },
            description: () => {
                if (formVal.description.length === 0) {
                    return this.errors[5];
                } else if (this.patterns
                    .get('spam')
                    .test(formVal.description) === false) {
                    return this.errors[6];
                }
            },
            nameSurname: () => {
                if (formVal.nameSurname.length === 0 ||
                    this.patterns
                        .get('name')
                        .test(formVal.nameSurname) === false) {
                    return this.errors[1];
                }
            },
            first_name: () => {
                if (formVal.first_name.length === 0 ||
                    this.patterns
                        .get('name')
                        .test(formVal.first_name) === false) {
                    return this.errors[1];
                }
            },
            second_name: () => {
                if (formVal.second_name.length === 0 ||
                    this.patterns
                        .get('name')
                        .test(formVal.second_name) === false) {
                    return this.errors[8];
                }
            },
            specializes: () => {
                if (formVal.specializes === 'err') {
                    return this.errors[10];
                }
            },
            password: () => {
                this.password = formVal.password;
                if (formVal.password.length === 0 ||
                    this.patterns
                        .get('password')
                        .test(formVal.password) === false) {
                    return this.errors[12];
                }
            },
            password_repeat: () => {
                if (formVal.password_repeat.length === 0 ||
                    this.patterns
                        .get('password')
                        .test(formVal.password_repeat) === false) {
                    return this.errors[12];
                }
                if (this.password !== formVal.password_repeat) {
                    return this.errors[13];
                }
            },
            budget: () => {
                if (formVal.budget.length === 0 ||
                    this.patterns
                        .get('price')
                        .test(formVal.budget) === false) {
                    return this.errors[14];
                }
            },
            submit: () => {
                return '';
            },
        };

        const res = validate[property]();
        if (res) {
            return res;
        }
        return '';
    }
}
