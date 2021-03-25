import {LoginController} from "./controllers/loginController.js";
import {ClientRegController} from "./controllers/clientRegController.js";

import router from "./modules/router.js";
import {MainPageController} from "./controllers/mainPageController.js";

const controllers = new Set([
    ['login', LoginController],
    ['client-reg', ClientRegController],
    ['main-page', MainPageController]
    // Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});

router.start();