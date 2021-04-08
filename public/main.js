import '@/../design/style/navbar_executor.css';
import '@/../design/style/navbar.css';
import '@/../design/style/root.css';
import '@/../design/style/orderPage.css';
import '@/../design/style/settings.css';
import '@/../design/style/select.css';

import {LoginController} from './controllers/loginController.js';
import {ClientRegController} from './controllers/clientRegController.js';
import {WorkerRegController} from './controllers/workerRegContoller.js';
import {SettingsController} from './controllers/settingsController.js';
import {OrderCreateController} from './controllers/orderCreateContoller.js';

import router from './modules/router.js';
import {MainPageController} from './controllers/mainPageController.js';
import {ProfileController} from './controllers/profileController.js';
import {OrderPageController} from './controllers/orderPageController.js';
import {
    CLIENT_REG_PAGE,
    LOGIN_PAGE,
    MAIN_PAGE,
    ORDER_CREATE_PAGE,
    ORDER_PAGE,
    PROFILE_PAGE,
    SETTINGS_PAGE,
    WORKER_REG_PAGE,
} from './modules/utils/pageNames.js';

const controllers = new Set([
    [LOGIN_PAGE, LoginController],
    [CLIENT_REG_PAGE, ClientRegController],
    [MAIN_PAGE, MainPageController],
    [WORKER_REG_PAGE, WorkerRegController],
    [PROFILE_PAGE, ProfileController],
    [SETTINGS_PAGE, SettingsController],
    [ORDER_CREATE_PAGE, OrderCreateController],
    [ORDER_PAGE, OrderPageController],
    // Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});

router.setUp();
router.start();
