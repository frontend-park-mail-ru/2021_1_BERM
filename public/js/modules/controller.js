import Valid from './valid.js'
import ajax from "./ajax.js";
import view from "./view.js";

export default {
    async Route() {
        document.title = 'FL.ru';
        await this.isAuthorization()
            .then(() => {
                view.viewMainPage();
            })
    },

    loginRoute() {
        document.title = 'Авторизация';

        view.viewSignIn();

        // Todo Отдельная Функция
        const form = document.getElementById('login__window');
        form.onsubmit = (event) => {
            event.preventDefault();

            let requestData = newFormData(event.target);

            ajax.sendRequest('POST', '/signin', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response !== undefined && response.isOk === undefined) {
                        await this.Route();
                        location.hash = '#';
                    } else {
                        InvalidLoginPassText();
                    }
                })
        }
    },

    clientRegRoute() {
        document.title = 'Регистрация';

        view.viewClientReg();

        Valid.runValid();

        // Todo Отдельная Функция
        const form = document.getElementsByTagName('form')[0];
        form.onsubmit = (event) => {
            event.preventDefault();

            let requestData = newFormData(event.target)

            ajax.sendRequest('POST', '/signup', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response !== undefined && response.isOk === undefined) {
                        await this.Route();
                        location.hash = '#';
                    } else {
                        alert("Пользователь с такой почтой уже зарегистрирован!");
                    }
                })
        }

    },

    workerRegRoute() {
        document.title = 'Регистрация';

        view.viewWorkerReg();

        Valid.runValid();

        // Todo Отдельная Функция
        const form = document.getElementsByTagName('form')[0];
        form.onsubmit = (event) => {
            event.preventDefault();

            let requestData = newFormData(event.target);
            requestData.executor = true;
            requestData.specializes = [requestData.specializes,];

            ajax.sendRequest('POST', '/signup', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response !== undefined && response.isOk === undefined) {
                        await this.Route();
                        location.hash = '#';
                    } else {
                        alert("Пользователь с такой почтой уже зарегистрирован!");
                    }
                })
        }
    },

    async profileRoute() {
        document.title = 'Профиль';

        await this.isAuthorization()
            .then(async () => {
                await ajax.sendRequest('GET', `/profile`)
                    .then(res => {
                        view.viewProfile({
                            name: res.first_name + ' ' + res.second_name,
                            nickName: res.user_name,
                            isExecutor: res.executor,
                            specialize: res.specializes,
                        })

                        // Todo Отдельная Функция
                        let img = document.getElementById('profile_img');
                        if (res.img_url === null || res.img_url === undefined) {
                            img.src = 'img/profile.jpg';
                        } else {
                            img.src = res.img_url;
                        }
                    })

                setProfileImgHandler();
            });
    },

    async exitRoute() {
        await ajax.sendRequest('GET', `/logout`)
        await this.loginRoute();
    },

    async settingsRoute() {
        document.title = 'Настройки';

        await this.isAuthorization()
            .then(async res => {
                view.viewSetting({
                    nickName: res.user_name,
                    surname: res.second_name,
                    name: res.first_name,
                    email: res.email,
                });

                // Todo Отдельная функция?
                const form = document.getElementsByTagName('form')[0];
                Valid.runValid();
                form.onsubmit = (event) => {
                    event.preventDefault();

                    let requestData = newFormData(event.target);

                    ajax.sendRequest('POST', '/profile/change', JSON.parse(JSON.stringify(requestData)))
                        .then(async () => {
                            await this.settingsRoute();
                            location.hash = '#/settings';
                            successChangeSettings();
                        });
                }
            });
    },

    async orderPageRoute() {
        document.title = 'Создание заказа';

        await this.isAuthorization()
            .then(async () => {
                view.viewOrderPage()
            });

        await Valid.runValid();

        // Todo: POST запрос
    },

    async isAuthorization() {
        return ajax.sendRequest('GET', '/profile')
            .then(res => {
                if (res !== undefined && res.id !== undefined) {
                    return Promise.resolve(res);
                } else {
                    this.loginRoute();
                    return Promise.reject();
                }
            })
    },
};

const newFormData = (form) => {
    let requestData = {};
    const formData = new FormData(form);

    for (let [name, value] of formData) {
        requestData[name] = value;
    }
    return requestData;
}

const setProfileImgHandler = () => {
    const inputImg = document.getElementById('file-input');
    inputImg.onchange = async (ev) => {
        let file = ev.target.files[0];
        const fReader = new FileReader();
        fReader.onload = async () => {
            let img = document.getElementById('profile_img')
            img.src = fReader.result;

            await ajax.sendRequest(
                'POST',
                '/profile/avatar',
                JSON.parse(JSON.stringify({img: img.src}))
            )
        };
        await fReader.readAsDataURL(file);
    }
}

const InvalidLoginPassText = () => {
    const ErrorText = document.querySelector('.login__error');
    ErrorText.innerHTML = `<div class="login__error">Неверный логин или пароль</div>`;
}

const successChangeSettings = () => {
    const successText = document.querySelector('.setting__success_text');
    successText.innerHTML = `<div class="setting__success_text">Успешно сохранено</div>`;
}
