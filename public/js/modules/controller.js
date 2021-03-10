import Valid from './valid.js'
import ajax from "./ajax.js";

const root = document.getElementById('root');

let saveData = {
    id: 0,
    img: 'img/profile.jpg',
};

export default {
    async Route() {
        document.title = 'FL.ru';
        await this.isAuthorization()
            .then(() => {
                root.innerHTML = navbarTemplate({
                    authorized: true,
                    profIcon: saveData.img
                }) + indexTemplate();
            })
    },

    loginRoute() {
        document.title = 'Авторизация';

        root.innerHTML = navbarTemplate() + signinTemplate();

        const form = document.getElementById('login__window');
        form.onsubmit = (event) => {
            event.preventDefault();

            // Todo: Валидация
            // Todo Тут добавить функцию валидации

            let requestData = newFormData(event.target);

            ajax.sendRequest('POST', 'https://findfreelancer.ru:8080/signin', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response.status === undefined) {
                        saveData.id = response.id;  // Todo Поле ID
                        await this.Route();
                        await this.addHandleLinks();
                    } else {
                        // Todo Неверный Логин или Пароль
                    }

                })
        }
    },

    clientRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + clientregTemplate();

        Valid.runValid();

        const form = document.getElementsByTagName('form')[0];
        form.onsubmit = (event) => {
            event.preventDefault();

            let requestData = newFormData(event.target)

            ajax.sendRequest('POST', 'https://findfreelancer.ru:8080/signup', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response.isOk === undefined) {
                        await this.Route();
                        await this.addHandleLinks();
                    } else {
                        // Todo Неверный Логин или Пароль или ошибка на сервере
                    }
                })
        }

    },

    workerRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + workerregTemplate();

        Valid.runValid();

        const form = document.getElementsByTagName('form')[0];
        form.onsubmit = (event) => {
            event.preventDefault();

            let requestData = newFormData(event.target);
            requestData.executor = true;
            requestData.specializes = [requestData.specializes,]; // Todo Работает ли это?

            ajax.sendRequest('POST', 'https://findfreelancer.ru:8080/signup', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response.isOk === undefined) {
                        await this.Route();
                        await this.addHandleLinks();
                    } else {
                        // Todo Неверный Логин или Пароль или ошибка на сервере
                    }
                })
        }
    },

    async profileRoute() {
        document.title = 'Профиль';

        await this.isAuthorization()
            .then(async () => {

                let profileInfo = {};

                await ajax.sendRequest('GET', `https://findfreelancer.ru:8080/profile`)
                    .then(res => {
                        profileInfo.name = res.first_name + ' ' + res.second_name;
                        profileInfo.profileImgUrl = res.img_url ? res.img_url : saveData.img;
                        profileInfo.nickName = res.user_name;
                        profileInfo.isExecutor = res.executor;

                        root.innerHTML = navbarTemplate({
                            authorized: true,
                            profIcon: saveData.img
                        }) + profileTemplate(profileInfo);
                    })

                const inputImg = document.getElementById('file-input');
                inputImg.oninput = (ev) => {
                    document.getElementById('profile_img').setAttribute('src', ev.target.value);
                    debugger
                }
            });

    },

    async exitRoute() {
        await ajax.sendRequest('GET', `https://findfreelancer.ru:8080/logout`)
        await this.loginRoute();
    },

    async settingsRoute() {
        document.title = 'Настройки';

        await this.isAuthorization()
            .then(async res => {
                const profileSettings = {
                    nickName: res.user_name,
                    surname: res.second_name,
                    name: res.first_name,
                    email: res.email,
                };

                root.innerHTML = navbarTemplate({
                    authorized: true,
                    profIcon: saveData.img
                }) + settingsTemplate(profileSettings);

                const form = document.getElementsByTagName('form')[0];
                form.onsubmit = (event) => {
                    event.preventDefault();

                    let requestData = newFormData(event.target);

                    ajax.sendRequest('POST', 'https://findfreelancer.ru:8080/profile/change', JSON.parse(JSON.stringify(requestData)))
                        .then(async () => {
                                await this.settingsRoute();
                                await this.addHandleLinks();
                        });
                }
            });
    },

    orderPageRoute() {
        document.title = 'Создание заказа';

        root.innerHTML = navbarTemplate() + orderpageTemplate();

        Valid.runValid();

        // Todo: POST запрос настроек
    },

    addHandleLinks() {
        const body = Array.from(document.getElementsByTagName('a'));
        for (let i = 0; i < body.length; ++i) {
            body[i].addEventListener('click', (event) => {
                event.preventDefault();

                const hash = body[i].getAttribute('href');
                location.hash = hash;

                this[hash.slice(1) + 'Route']();
                this.addHandleLinks();
            })
        }
    },

    async isAuthorization() {
        return ajax.sendRequest('GET', 'https://findfreelancer.ru:8080/profile')
            .then(res => {
                if (res.id !== undefined) {
                    return Promise.resolve(res);
                } else {
                    this.loginRoute()
                    this.addHandleLinks()
                    return Promise.reject();
                }
            })
    }
};

function newFormData(form) {
    let requestData = {};
    const formData = new FormData(form);

    for (let [name, value] of formData) {
        requestData[name] = value;
    }

    return requestData;
}
