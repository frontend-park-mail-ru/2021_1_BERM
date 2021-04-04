import '@/static/css/index.css';
import '@/static/css/login.css';
import '@/static/css/navbar.css';
import '@/static/css/profile.css';
import '@/static/css/reg.css';
import '@/static/css/settings.css';
import '@/static/css/signIn.css';
import '@/static/css/valid.css';

import {LoginController} from './controllers/loginController.js';
import {ClientRegController} from './controllers/clientRegController.js';
import {WorkerRegController} from './controllers/workerRegContoller.js';
import {SettingsController} from './controllers/settingsController.js';
import {OrderController} from './controllers/orderContoller.js';

import router from './modules/router.js';
import {MainPageController} from './controllers/mainPageController.js';
import {ProfileController} from './controllers/profileController.js';
import {
    CLIENT_REG_PAGE,
    LOGIN_PAGE,
    MAIN_PAGE,
    ORDER_CREATE_PAGE,
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
    [ORDER_CREATE_PAGE, OrderController],
    // Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});


router.setUp();
router.start();
