import Utils from './utils.js'

export class ValidHandler {
    constructor() {
        this.errors = Utils.getAllErrors();
        this.patterns = Utils.getAllPatterns();
        this.password = '';
    }

    getError(formVal, property) {
            const validate = {
                user_name: () => {
                    if (formVal.user_name.length === 0 || this.patterns.get('user_name').test(formVal.user_name) === false) {
                        return this.errors[7];
                    }
                },
                email: () => {
                    if (formVal.email.length === 0) {
                        return this.errors[2];
                    } else if (this.patterns.get('mail').test(formVal.email) === false) {
                        return this.errors[3];
                    }
                },
                order_name: () => {
                    if (formVal.order_name.length === 0) {
                        return this.errors[4];
                    } else if (this.patterns.get('spam').test(formVal.order_name) === false) {
                        return this.errors[6];
                    }
                },
                about: () => {
                    if (formVal.about.length === 0) {
                        return this.errors[5];
                    } else if (this.patterns.get('spam').test(formVal.about) === false) {
                        return this.errors[6];
                    }
                },
                description: () => {
                    if (formVal.description.length === 0) {
                        return this.errors[5];
                    } else if (this.patterns.get('spam').test(formVal.description) === false) {
                        return this.errors[6];
                    }
                },
                first_name: () => {
                    // console.log(this.patterns.get('name'))
                    if (formVal.first_name.length === 0 || this.patterns.get('name').test(formVal.first_name) === false) {
                        return this.errors[1];
                    }
                },
                second_name: () => {
                    if (formVal.second_name.length === 0 || this.patterns.get('name').test(formVal.second_name) === false) {
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
                    if (formVal.password.length === 0 || this.patterns.get('password').test(formVal.password) === false) {
                        return this.errors[12];
                    }
                },
                password_repeat: () => {
                    if (formVal.password_repeat.length === 0 || this.patterns.get('password').test(formVal.password_repeat) === false) {
                        return this.errors[12];
                    }
                    if (this.password !== formVal.password_repeat) {
                        return this.errors[13];
                    }
                },
                budget: () => {
                    if (formVal.budget.length === 0 || this.patterns.get('budget').test(formVal.budget) === false) {
                        return this.errors[14];
                    }
                },
                submit: () => {
                    return '';
                }
            };
        validate[property]();
    }
}