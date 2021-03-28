import Utils from './utils.js'

export class ValidHandler {
    constructor() {
        this.errors = Utils.getAllErrors();
        this.patterns = Utils.getAllPatterns();
        this.password = '';
    }

    getError(formVal, property) {
        let error = '',
            validate = {
                'user_name': () => {
                    if (formVal.user_name.length === 0 || this.patterns.get('user_name').test(formVal.user_name) === false) {
                        error = this.errors[7];
                    }
                },
                'email': () => {
                    if (formVal.email.length === 0) {
                        error = this.errors[2];
                    } else if (this.patterns.get('mail').test(formVal.email) === false) {
                        error = this.errors[3];
                    }
                },
                'subject': () => {
                    if (formVal.subject.length === 0) {
                        error = this.errors[4];
                    } else if (this.patterns.get('spam').test(formVal.subject) === false) {
                        error = this.errors[6];
                    }
                },
                'description': () => {
                    if (formVal.description.length === 0) {
                        error = this.errors[5];
                    } else if (this.patterns.get('spam').test(formVal.description) === false) {
                        error = this.errors[6];
                    }
                },
                'first_name': () => {
                    // console.log(this.patterns.get('name'))
                    if (formVal.first_name.length === 0 || this.patterns.get('name').test(formVal.first_name) === false) {
                        error = this.errors[1];
                    }
                },
                'second_name': () => {
                    if (formVal.second_name.length === 0 || this.patterns.get('name').test(formVal.second_name) === false) {
                        error = this.errors[8];
                    }
                },
                'specializes': () => {
                    if (formVal.specializes === 'err') {
                        error = this.errors[10];
                    }
                },
                'password': () => {
                    this.password = formVal.password;
                    if (formVal.password.length === 0 || this.patterns.get('password').test(formVal.password) === false) {
                        error = this.errors[12];
                    }
                },
                'password_repeat': () => {
                    if (formVal.password_repeat.length === 0 || this.patterns.get('password').test(formVal.password_repeat) === false) {
                        error = this.errors[12];
                    }
                    if (this.password !== formVal.password_repeat) {
                        error = this.errors[13];
                    }
                },
                'price': () => {
                    if (formVal.price.length === 0 || this.patterns.get('price').test(formVal.price) === false) {
                        error = this.errors[14];
                    }
                },
                'submit': () => {
                    error = ''
                }
            };
        validate[property]();
        return error;
    }
}