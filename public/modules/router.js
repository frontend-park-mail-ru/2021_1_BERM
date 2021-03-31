class Router {
    constructor() {
        this.states = {};
    }

    register(path, controller) {
        this.states[path] = {
            controller : controller,
        }
    }

    setUp() {
        // Навешиваем обработчик на клики
        const body = document.getElementsByTagName('body')[0];
        body.addEventListener('click', (event) => {
            // ToDo: Сделать через instanceof
            if ((event.target.localName === 'a' || event.target.localName === 'img') &&
                event.target.href !== '') {
                event.preventDefault();
                this.go(event.target.getAttribute('href'));
            }
        });

        addEventListener('popstate',() => {
            this.start();
        },false);

        // ToDo(Алексей Егоров): Здесь идет загрузка страницы по path при перезагрузке.
        //  Нужно обрабатывать текущий pathname. (Пока костыль)
        this.startPath = 'main-page';
    }

    go(path) {
        history.pushState(
            {page: path},
            '',
            '/' + path
        );

        this.start();
    }

    start() {
        let currentState = history.state;

        if (!currentState) {
            currentState = {
                page: this.startPath,
            };
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