class Router {
    constructor() {
        this.states = {};
        this.isFirstEnter = true;
    }

    register(path, controller) {
        this.states[path] = {
            controller : controller,
        }
    }

    go(path, title) {
        history.pushState(
            {page: path},
            title,
            '/' + path
        );

        this.start();
    }

    start() {
        let currentState = history.state;

        if (!currentState) {
            currentState = {
                page: 'main-page',
            };
        }

        if (this.isFirstEnter) {
            this.isFirstEnter = false;


            // Навешиваем обработчик на клики
            const body = document.getElementsByTagName('body')[0];
            body.addEventListener('click', (event) => {
                // ToDo: Сделать через instanceof
                if ((event.target.localName === 'a' || event.target.localName === 'img') &&
                    event.target.href !== '') {
                    event.preventDefault();
                    this.go(event.target.getAttribute('href'),
                        event.target.getAttribute('data-title'));
                }
            });

            addEventListener('popstate',() => {
                this.start();
            },false);


            // ToDo(Алексей Егоров): Здесь идет загрузка страницы по path при перезагрузке.
            //  Нужно обрабатывать текущий pathname. (Пока костыль)
        }

        const controller = this.states[currentState.page].controller;

        if (this.currentController) {
            this.currentController.offAll();
        }

        this.currentController = new controller();
        this.currentController.run();
    }
}

export default new Router();