import Valid from './valid.js'
import Menu from './menu.js'
import ajax from "./ajax.js";

const root = document.getElementById('root');
let saveData = {
    authorized: false,
    id: 0,
    img: 'img/profile.jpg',
};

export default {
    Route() {
        document.title = 'FL.ru';

        if (saveData.authorized) {
            // Todo Запрос изображения. Сохраняем его в saveData
        }

        root.innerHTML = navbarTemplate({
            authorized : saveData.authorized,
            profIcon : saveData.img
        }) + indexTemplate();
        // Menu.runMenu()
    },

    loginRoute() {
        document.title = 'Авторизация';

        root.innerHTML = navbarTemplate() + signinTemplate();

        const form = document.getElementById('login__window');
        form.onsubmit = async (event) => {
            event.preventDefault();

            // Todo: Валидация
            // Todo Тут добавить функцию валидации

            let requestData= { };
            const formData = new FormData(event.target);

            for(let [name, value] of formData) {
                requestData[name] = value;
            }
            ajax.sendRequest('POST', 'http://95.163.212.121:8080/signin', JSON.parse(JSON.stringify(requestData)))
            // Todo возвращается стуктуру или ее сохранить или изменить API
                .then(response => {
                    if (response!= null && response.status === undefined) {
                        saveData.authorized = true;
                        saveData.id = response.id;
                        // email: "pekanbo3333y7@gmail.com"
                        // executor: false
                        // first_name: "dasd"
                        // id: 25
                        // second_name: "dasasd"
                        // user_name: "asdssad"
                        this.Route();
                        this.addHandleLinks();
                    }
                    // Todo Неверный Логин или Пароль или ошибка на сервере
                })
        }
    },

    clientRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + clientregTemplate();
        Valid.runValid();

        const form = document.getElementsByTagName('form')[0];
        form.onsubmit = async (event) => {
            event.preventDefault();
            // Todo Тут добавить функцию валидации!!

            let requestData= { };
            const formData = new FormData(event.target);

            for(let [name, value] of formData) {
                requestData[name] = value;
            }
            requestData.Executor = false;

            ajax.sendRequest('POST', 'http://95.163.212.121:8080/signup', JSON.parse(JSON.stringify(requestData)))
                // Todo возвращается структуру или ее сохранить или изменить API
                .then(response => {
                    if (response!= null && response.status === undefined) {
                        this.loginRoute();
                        alert("Вы успешно зарегались. Войдите."); // Todo убрать
                        this.addHandleLinks();
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
        form.onsubmit = async (event) => {
            event.preventDefault();

            // Todo Тут добавить функцию валидации!!

            let requestData= { };
            const formData = new FormData(event.target);

            for(let [name, value] of formData) {
                requestData[name] = value;
            }
            requestData.executor = true;

            ajax.sendRequest('POST', 'http://95.163.212.121:8080/signup', JSON.parse(JSON.stringify(requestData)))
                .then(response => {
                    if (response != null && response.status === undefined) {
                        this.loginRoute();
                        this.addHandleLinks();
                    } else {
                        // Todo Неверный Логин или Пароль или ошибка на сервере
                    }
                })
        }
    },

    profileRoute() {
        // Todo Получить изображение
        const profileInfo = {
            profileImgUrl: "img/profile.jpg",
        }

        // if (!saveData.authorized) {
        //
        // }
        ajax.sendRequest('POST', `http://95.163.212.121:8080/profile/${saveData.id}`)
            .then(res => console.log(res))


        document.title = 'Профиль';

        root.innerHTML = navbarTemplate({
            authorized : saveData.authorized,
            profIcon : saveData.img
        }) + profileTemplate(profileInfo);
        Menu.runMenu()
    },

    settingsRoute() {
        document.title = 'Настройки';

        const profileSettings = {
            name: "Олег",
            surname: "Реуцкий",
            nickName: "astlok",
            email: "astlok@ya.ru",
        }
        root.innerHTML = navbarTemplate({
            authorized : saveData.authorized,
            profIcon : saveData.img
        }) + settingsTemplate(profileSettings);
 
    },

    orderPageRoute() {
        document.title = 'Создание заказа';

        root.innerHTML = navbarTemplate() + orderpageTemplate();
        Valid.runValid();
        
        // Todo: Валидация
        // Todo: POST запрос настроек
    },

    addHandleLinks() {
    const body = Array.from(document.getElementsByTagName('a'));
    for(let i = 0; i < body.length; ++i) {
        body[i].addEventListener('click', (event) => {
            event.preventDefault();

            const hash = body[i].getAttribute('href');
            location.hash = hash;

            this[hash.slice(1) + 'Route']();
            this.addHandleLinks();
        })
    }
}
};
