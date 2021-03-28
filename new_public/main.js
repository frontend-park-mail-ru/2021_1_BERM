import {LoginController} from "./controllers/loginController.js";
import {ClientRegController} from "./controllers/clientRegController.js";
import {WorkerRegController} from "./controllers/workerRegContoller.js";

import router from "./modules/router.js";
import {MainPageController} from "./controllers/mainPageController.js";

const controllers = new Set([
    ['login', LoginController],
    ['client-reg', ClientRegController],
    ['main-page', MainPageController],
    ['worker-reg', WorkerRegController]
    // Здесь добавляем странички
]);
debugger
controllers.forEach((value) => {
    router.register(value[0], value[1]);
});
debugger

router.start();