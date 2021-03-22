class Router {
    constructor() {
        this.states = {}
    }

    register(path, controller) {
        this.states[path] = {
            controller : controller,
        }
    }

    go(path) {
        history.pushState(
            {page: path},
            'FindFreelancer',
            '/' + path
        )

        this.start();
    }

    start() {
        let currentState = history.state;

        if (!currentState) {
            // ToDo(Алексей Егоров): Здесь идет загрузка страницы по path при перезагрузке.
            //  Нужно обрабатывать текущий pathname. (Пока костыль)
            currentState = {
                path: 'login'
            };
        }

        const controller = this.states[currentState.path].controller;

        if (this.currentController) {
            this.currentController.offAll();
        }

        this.currentController = new controller();
        this.currentController.run();
    }
}

export default new Router();