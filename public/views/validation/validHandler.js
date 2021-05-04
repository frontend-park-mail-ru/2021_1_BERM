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
                if (formVal.order_name.length > 100 ||
                    formVal.order_name.length === 0) {
                    return this.errors[18];
                }
                if (this.patterns
                    .get('spam')
                    .test(formVal.order_name) === false) {
                    return this.errors[6];
                }
            },
            about: () => {
                if (formVal.about.length > 500 ||
                    formVal.about.length === 0) {
                    return this.errors[18];
                }
                console.log(formVal.about);
                if (this.patterns
                    .get('spam')
                    .test(formVal.about) === false) {
                    return this.errors[6];
                }
            },
            description: () => {
                if (formVal.description.length > 500 ||
                    formVal.description.length === 0) {
                    return this.errors[18];
                }
                if (this.patterns
                    .get('spam')
                    .test(formVal.description) === false) {
                    return this.errors[6];
                }
            },
            rateExecutor: () => {
                if (formVal.rateExecutor.length > 500 ||
                    formVal.rateExecutor.length < 40) {
                    return this.errors[18];
                }
                if (this.patterns
                    .get('spam')
                    .test(formVal.rateExecutor) === false) {
                    return this.errors[6];
                }
            },
            rating: () => {
            },
            nameSurname: () => {
                if (formVal.nameSurname.length > 50 ||
                    formVal.nameSurname.length === 0) {
                    return this.errors[18];
                }

                if (this.patterns
                    .get('name')
                    .test(formVal.nameSurname) === false) {
                    return this.errors[1];
                }
            },
            name: () => {
                if (formVal.name.length > 20 ||
                    formVal.name.length === 0) {
                    return this.errors[18];
                }
                if (this.patterns
                    .get('name')
                    .test(formVal.name) === false) {
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
            category: () => {
                if (formVal.category === 'Категория') {
                    return this.errors[10];
                }
            },
            rate: () => {
                if (formVal.rate.length === 0 ||
                    formVal.rate.length > 9) {
                    return this.errors[20];
                }
                if (this.patterns
                    .get('price')
                    .test(formVal.rate) === false) {
                    return this.errors[16];
                }
                if (Number(formVal.rate) <= 0) {
                    return this.errors[16];
                }
            },
            oldPassword: () => {
                this.oldPassword = formVal.oldPassword;
                if (formVal.oldPassword.length === 0 ||
                    this.patterns
                        .get('password')
                        .test(formVal.oldPassword) === false) {
                    return this.errors[12];
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
            passwordRepeat: () => {
                if (formVal.passwordRepeat.length === 0) {
                    return this.errors[13];
                }
                if (this.password !== formVal.passwordRepeat) {
                    return this.errors[13];
                }
            },
            budget: () => {
                if (formVal.budget.length === 0 ||
                    formVal.budget.length > 9) {
                    return this.errors[20];
                }
                if (this.patterns
                    .get('price')
                    .test(formVal.budget) === false) {
                    return this.errors[14];
                }
                if (Number(formVal.budget) <= 0) {
                    return this.errors[14];
                }
            },
            date: () => {
                if (formVal.date.length === 0 ||
                    this.patterns
                        .get('date')
                        .test(formVal.date) === false) {
                    return this.errors[15];
                }
                const components = formVal.date
                    .split('.')
                    .map((item) => {
                        return Number(item);
                    });

                const listofDays = [31, 28, 31, 30, 31, 30,
                    31, 31, 30, 31, 30, 31];

                const date = new Date();
                const day = date.getDate();
                const month = date.getMonth();
                const year = date.getFullYear();

                if (components[2] < year) {
                    return this.errors[15];
                }
                if (components[2] > year + 100) {
                    return this.errors[17];
                }
                if (components[0] > listofDays[Number(components[1]) - 1] ||
                components[0] < 1) {
                    return this.errors[15];
                }
                if (components[2] > year) {
                    return;
                }
                if (components[1] < month) {
                    return this.errors[15];
                }
                if (components[1] > month) {
                    return;
                }
                if (components[0] < day) {
                    return this.errors[15];
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
