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
                this.addHandleLinks();
            })
    },

    loginRoute() {
        document.title = 'Авторизация';

        root.innerHTML = navbarTemplate() + signinTemplate();
        this.addHandleLinks();

        const form = document.getElementById('login__window');
        form.onsubmit = (event) => {
            event.preventDefault();

            // Todo: Валидация
            // Todo Тут добавить функцию валидации

            let requestData = newFormData(event.target);

            ajax.sendRequest('POST', 'https://findfreelancer.ru:8080/signin', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response !== undefined && response.isOk === undefined) {
                        saveData.id = response.id;  // Todo Поле ID
                        await this.Route();
                        await this.addHandleLinks();
                    } else {
                        alert('Неверные логин или пароль');
                    }
                })
        }
    },

    clientRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + clientregTemplate();
        this.addHandleLinks();

        Valid.runValid();

        const form = document.getElementsByTagName('form')[0];
        form.onsubmit = (event) => {
            event.preventDefault();

            let requestData = newFormData(event.target)

            ajax.sendRequest('POST', 'https://findfreelancer.ru:8080/signup', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response !== undefined &&response.isOk === undefined) {
                        await this.Route();
                        await this.addHandleLinks();
                    } else {
                        alert("Пользователь с такой почтой уже зарегистрирован!");  // Todo КОСТЫЛЬ ВЫВОДИТЬ КРАСИВО
                    }
                })
        }

    },

    workerRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + workerregTemplate();
        this.addHandleLinks();

        Valid.runValid();

        const form = document.getElementsByTagName('form')[0];
        form.onsubmit = (event) => {
            event.preventDefault();

            let requestData = newFormData(event.target);
            requestData.executor = true;
            requestData.specializes = [requestData.specializes,]; // Todo Работает ли это?

            ajax.sendRequest('POST', 'https://findfreelancer.ru:8080/signup', JSON.parse(JSON.stringify(requestData)))
                .then(async response => {
                    if (response !== undefined && response.isOk === undefined) {
                        await this.Route();
                        await this.addHandleLinks();
                    } else {
                        alert("Пользователь с такой почтой уже зарегистрирован!");  // Todo КОСТЫЛЬ ВЫВОДИТЬ КРАСИВО
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
                        profileInfo.specialize = res.specializes[0];

                        root.innerHTML = navbarTemplate({
                            authorized: true,
                            profIcon: saveData.img
                        }) + profileTemplate(profileInfo);
                        this.addHandleLinks();
                    })

                const inputImg = document.getElementById('file-input');
                inputImg.onchange = async (ev) => {
                    let file = ev.target.files[0];
                    let freader = new FileReader();
                    freader.onload = () => {
                        document.getElementById('profile_img').src = freader.result;
                    }
                    await freader.readAsDataURL(file);

                    ev.target.toBlob(function(blob) {
                        console.log(URL.createObjectURL(blob));
                    }, 'image/jpeg');
                }
            });

    },

    async exitRoute() {
        await ajax.sendRequest('GET', `https://findfreelancer.ru:8080/logout`)
        await this.loginRoute();
        await this.addHandleLinks();
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
                this.addHandleLinks();

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

    async orderPageRoute() {
        document.title = 'Создание заказа';

        await this.isAuthorization()
            .then(async () => {
                root.innerHTML = await navbarTemplate({
                    authorized: true,
                    profIcon: saveData.img
                }) + await orderpageTemplate();
                this.addHandleLinks();
            });

        await Valid.runValid();

        // Todo: POST запрос
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
                if (res !== undefined && res.id !== undefined) {
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
