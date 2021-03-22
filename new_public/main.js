import {LoginController} from "./controllers/loginController.js";

import router from "./modules/router.js";

const controllers = new Set([
    ['login', LoginController],
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});

router.start();