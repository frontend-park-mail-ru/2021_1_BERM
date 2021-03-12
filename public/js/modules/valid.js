export default {
    runValid() {
        'use strict';

        let form = document.getElementById('feedback');
        if (!form) return;


        let elements = form.querySelectorAll('.form-control'),
            btn = document.getElementById('send_mess'),
            patternName = /^[а-яёА-ЯЁ\s]+$/,
            patternMail = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z])+$/,
            patternSpam = /[^\<\>\[\]%\&'`]+$/,
            patternLog = /^[a-zA-Z0-9]{0,19}$/,
            patternPhone = /^\+?\d{1,3}?[- .]?\(?(?:\d{2,3})\)?[- .]?\d\d\d[- .]?\d\d\d\d$/,
            patternPassword = /([a-z]+[A-Z]+[0-9]+|[a-z]+[0-9]+[A-Z]+|[A-Z]+[a-z]+[0-9]+|[A-Z]+[0-9]+[a-z]+|[0-9]+[a-z]+[A-Z]+|[0-9]+[A-Z]+[a-z]+)/,
            patternPrice = /^[0-9]+$/,
            errorMess = [
                'Незаполненное поле ввода', // 0
                'Введите имя на кириллице', // 1
                'Укажите Вашу электронную почту', // 2
                'Неверный формат электронной почты', // 3
                'Укажите тему сообщения', // 4
                'Напишите текст сообщения', // 5
                'Ваше сообщение похоже на спам, уберите специальные символы.', // 6
                'Неподходящий логин', // 7
                'Введите фамилию на кириллице', // 8
                'Ваше сообщение похоже на спам, уберите специальные символы.', // 9
                'Выберите специальность из списка', // 10
                'Неверный формат телефонного номера', // 11
                'Плохой пароль',  // 12
                'Введите цену в рублях',  // 13
            ],
            iserror = false;

        btn.addEventListener('click', (e) => {
            let formVal = getFormData(form),
                error;

            for (let property in formVal) {
                error = getError(formVal, property);
                if (error.length !== 0) {
                    iserror = true;
                    showError(property, error);
                } else if (error.length === 0) {
                    showValid(property)
                }
            }

            if (iserror) {
                e.preventDefault();
            } else {
                // sendFormData(formVal);
            }
            return false;
        });

        form.addEventListener('focus',  () => {
            let el = document.activeElement;
            if (el !== btn) {
                cleanError(el);
                cleanValid(el);
            }
        }, true);

         let getError = (formVal, property) => {
            let error = '',
                validate = {
                    'user_name':  () => {
                        if (formVal.user_name.length === 0 || patternLog.test(formVal.user_name) === false) {
                            error = errorMess[7];
                        }
                    },
                    'email': () => {
                        if (formVal.email.length === 0) {
                            error = errorMess[2];
                        } else if (patternMail.test(formVal.email) === false) {
                            error = errorMess[3];
                        }
                    },
                    'subject': () => {
                        if (formVal.subject.length === 0) {
                            error = errorMess[4];
                        } else if (patternSpam.test(formVal.subject) === false) {
                            error = errorMess[6];
                        }
                    },
                    'textmess': () => {
                        if (formVal.textmess.length === 0) {
                            error = errorMess[5];
                        } else if (patternSpam.test(formVal.textmess) === false) {
                            error = errorMess[6];
                        }
                    },
                    'first_name': () => {
                        if (formVal.first_name.length === 0 || patternName.test(formVal.first_name) === false) {
                            error = errorMess[1];
                        }
                    },
                    'second_name': () => {
                        if (formVal.second_name.length === 0 || patternName.test(formVal.second_name) === false) {
                            error = errorMess[8];
                        }
                    },
                    'specializes': () => {
                        if (formVal.specializes === 'err') {
                            error = errorMess[10];
                        }
                    },
                    'phone': () => {
                        if (formVal.phone.length === 0 || patternPhone.test(formVal.phone) === false) {
                            error = errorMess[11];
                        }
                    },
                    'password': () => {
                        if (formVal.password.length === 0 || patternPassword.test(formVal.password) === false) {
                            error = errorMess[12];
                        }
                    },
                    'price': () => {
                        if (formVal.price.length === 0 || patternPrice.test(formVal.price) === false) {
                            error = errorMess[13];
                        }
                    },
                    'submit': () => {
                        error = ''
                    }
                };
            validate[property]();
            return error;
        }

        [].forEach.call(elements,  (element) => {
            element.addEventListener('blur',  (e) => {
                let formElement = e.target,
                    property = formElement.getAttribute('name'),
                    dataField = {};

                dataField[property] = formElement.value;

                let error = getError(dataField, property);
                if (error.length !== 0) {
                    showError(property, error);
                } else if (error.length === 0) {
                    showValid(property)
                }
                return false;
            });
        });

        let showError = (property, error) => {
            let formElement = form.querySelector('[name=' + property + ']')
            let errorBox = formElement.parentElement.nextElementSibling;

            formElement.classList.add('form-control_error');
            errorBox.innerHTML = error;
            errorBox.style.display = 'block';
        }

        let showValid = (property) => {
            if (property !== 'submit') {
                let formElement = form.querySelector('[name=' + property + ']'),
                    validBox = formElement.parentElement.nextElementSibling;

                formElement.classList.add('form-control_valid');
                validBox.innerHTML = "";
                validBox.style.display = 'block';
            }
        }

        let cleanError = (el) => {
            let errorBox = el.parentElement.nextElementSibling;
            errorBox.innerHTML = ""
            el.classList.remove('form-control_error');
            errorBox.removeAttribute('style');
        }

        let cleanValid = (el) => {
            let validBox = el.parentElement.nextElementSibling;
            validBox.innerHTML = ""
            el.classList.remove('form-control_valid');
            validBox.removeAttribute('style');
        }

        let getFormData = (form) => {
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
}
;