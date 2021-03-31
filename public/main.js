import {LoginController} from "./controllers/loginController.js";
import {ClientRegController} from "./controllers/clientRegController.js";
import {WorkerRegController} from "./controllers/workerRegContoller.js";
import {SettingsController} from "./controllers/settingsController.js";
import {OrderController} from "./controllers/orderContoller.js";

import router from "./modules/router.js";
import {MainPageController} from "./controllers/mainPageController.js";
import {ProfileController} from "./controllers/profileController.js";

const controllers = new Set([
    ['login', LoginController],
    ['client-reg', ClientRegController],
    ['main-page', MainPageController],
    ['worker-reg', WorkerRegController],
    ['profile', ProfileController],
    ['settings', SettingsController],
    ['order-page', OrderController]
    // Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});


router.setUp();
router.start();