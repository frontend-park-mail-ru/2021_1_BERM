import ajax from "./ajax.js";

const root = document.getElementById('root');
let saveData = {
    authorized: true,
    img: 'img/profile.jpg',
};

export default {
    Route() {
        document.title = 'FL.ru';

        if (saveData.authorized) {
            // Todo Запрос изображения. Сохраняем его в saveData
        }

        // eslint-disable-next-line no-undef
        root.innerHTML = navbarTemplate({
            authorized : saveData.authorized,
            profIcon : saveData.img, // Todo ?
        }) + indexTemplate();
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
            // Todo Поставить нормальный URL и проверить работу
            ajax.sendRequest('POST', 'http://95.163.212.121:8080/signin', JSON.parse(JSON.stringify(requestData)))
            // Todo возвращается стуктуру или ее сохранить или изменить API
                .then(response => {
                    if (response.status === undefined) {
                        saveData.authorized = true;
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

        const form = document.getElementById('client_registration');
        form.onsubmit = async (event) => {
            event.preventDefault();

            // Todo: Валидация

            // Todo Тут добавить функцию валидации!!

            let requestData= { };
            const formData = new FormData(event.target);

            for(let [name, value] of formData) {
                requestData[name] = value;
            }
            requestData.Executor = false;

            console.log(JSON.parse(JSON.stringify(requestData)))
            let res = ajax.sendRequest('POST', 'http://95.163.212.121:8080/signup', JSON.parse(JSON.stringify(requestData)))
                // Todo возвращается структуру или ее сохранить или изменить API
                .then(response => {
                    if (res!= null && response.status === undefined) {
                        this.loginRoute();
                        this.addHandleLinks();
                    } else {
                        console.log(res);
                        // Todo Неверный Логин или Пароль или ошибка на сервере
                    }
                })
        }


    },

    workerRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + workerregTemplate();

        const form = document.getElementById('worker_registration');
        form.onsubmit = async (event) => {
            event.preventDefault();

            // Todo: Валидация

            // Todo Тут добавить функцию валидации!!

            let requestData= { };
            const formData = new FormData(event.target);

            for(let [name, value] of formData) {
                requestData[name] = value;
            }
            requestData.Executor = true;

            console.log(JSON.parse(JSON.stringify(requestData)))
            let res = ajax.sendRequest('POST', 'http://95.163.212.121:8080/signup', JSON.parse(JSON.stringify(requestData)))
                // Todo возвращается структуру или ее сохранить или изменить API
                .then(response => {
                    if (res!= null && response.status === undefined) {
                        this.loginRoute();
                        this.addHandleLinks();
                    } else {
                        console.log(res);
                        // Todo Неверный Логин или Пароль или ошибка на сервере
                    }
                })
        }
    },

    profileRoute() {
        const profileInfo = {
            profileImgUrl: "img/profile.jpg",
            name: "Олег Реуцкий",
            nickName: "astlok",
            specialize: "Мобильная разработка",
            reviews: {
                all: 25,
                good: 20,
                bad: 5,
            },
            rating: 5,
            totalOrders: 30,
            about: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut non eaque veniam quisquam temporibus nihil id " +
                "tempora rerum, cumque, aliquid voluptatem nemo cum hic reiciendis obcaecati laudantium fuga quia aperiam. " +
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat impedit cumque voluptate pariatur ipsam " +
                "expedita temporibus! Dolore inventore veritatis iusto quisquam, laboriosam soluta provident aliquid illum, " +
                "numquam similique ea voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae fugit accusamus " +
                "aliquam enim molestias voluptatem ipsa Yarik davai delay rekursiy quam voluptatum quibusdam cupiditate, ex eius. Accusamus voluptate " +
                "veritatis laudantium similique cumque, numquam dolor. Lorem ipsum dolor sit, amet consectetur adipisicing elit. " +
                "Repellat eos unde dolores ab explicabo eveniet dolorum voluptates quam nesciunt pariatur? Sit iste consectetur, " +
                "harum ex commodi repellat porro velit ut."
        } // Временная структура
        // Todo: Тут запрос профиля

        document.title = 'Профиль';

        root.innerHTML = navbarTemplate() + profileTemplate(profileInfo);
    },

    settingsRoute() {
        document.title = 'Настройки';

        const profileSettings = {
            name: "Олег",
            surname: "Реуцкий",
            nickName: "astlok",
            email: "astlok@ya.ru",
            phone: "2283221488",
        }

        const profNavbar = {
            authorized: true,
            profIcon: "img/profIcon.png"
        }

        root.innerHTML = navbarTemplate(profNavbar) + settingsTemplate(profileSettings)

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
