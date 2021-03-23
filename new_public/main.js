import {LoginController} from "./controllers/loginController.js";
import {ClientRegController} from "./controllers/clientRegController.js";

import router from "./modules/router.js";

const controllers = new Set([
    ['login', LoginController],
    ['client-reg', ClientRegController]
    // ToDo(Алексей Егоров): Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});

router.start();