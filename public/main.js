// import '@/static/css/navbar_executor.css';
// import '@/static/css/navbar.css';
// import '@/static/css/root.css';
// import '@/static/css/orderPage.css';
// import '@/static/css/settings.css';
// import '@/static/css/select.css';
// import '@/static/css/login.css';
// import '@/static/scss/registration.css';
// import '@/static/css/main.css';
// import '@/static/css/profile.css';
// import '@/static/css/orderPageCustomer.css';
// import '@/static/css/orderPageWithRate.css';
// import '@/static/css/orders.css';
// import '@/static/css/valid.css';
// import '@/static/css/vacancy.css';
// import '@/static/css/selectSpec.css';

import './static/scss/main_page.scss';
import './static/scss/login.scss';
import './static/scss/valid.scss';
import './static/scss/orders.scss';
import './static/scss/selectSpec.scss';
import './static/scss/select.scss';
import './static/scss/navbar_executor.scss';
import './static/scss/root.scss';
import './static/scss/navbar.scss';
import './static/scss/profile.scss';
import './static/scss/settings.scss';
import './static/scss/registration.scss';
import './static/scss/orderPage.scss';

import {LoginController} from './controllers/loginController.js';
import {ClientRegController} from './controllers/clientRegController.js';
import {WorkerRegController} from './controllers/workerRegContoller.js';
import {SettingsController} from './controllers/settingsController.js';
import {OrderCreateController} from './controllers/orderCreateContoller.js';
import {
    VacancyCreateController,
} from './controllers/vacancyCreateController.js';

import router from './modules/router.js';
import {MainPageController} from './controllers/mainPageController.js';
import {ProfileController} from './controllers/profileController.js';
import {OrderPageController} from './controllers/orderPageController.js';
import {OrdersController} from './controllers/ordersContoller.js';
import {VacancyPageController} from './controllers/vacancyPageController.js';
import {SelectSpecController} from './controllers/selectSpecController.js';
import {
    CLIENT_REG_PAGE,
    LOGIN_PAGE,
    MAIN_PAGE,
    ORDER_CREATE_PAGE,
    ORDER_PAGE,
    PROFILE_PAGE,
    SETTINGS_PAGE,
    WORKER_REG_PAGE,
    ORDERS_PAGE,
    VACANCY_CREATE_PAGE,
    VACANCY_PAGE,
    SELECT_SPEC,
    MY_ORDERS,
} from './modules/utils/pageNames.js';

const controllers = new Set([
    [MAIN_PAGE, MainPageController],
    [LOGIN_PAGE, LoginController],
    [CLIENT_REG_PAGE, ClientRegController],
    [WORKER_REG_PAGE, WorkerRegController],
    [PROFILE_PAGE, ProfileController],
    [SETTINGS_PAGE, SettingsController],
    [ORDER_CREATE_PAGE, OrderCreateController],
    [ORDER_PAGE, OrderPageController],
    [ORDERS_PAGE, OrdersController],
    [VACANCY_CREATE_PAGE, VacancyCreateController],
    [VACANCY_PAGE, VacancyPageController],
    [SELECT_SPEC, SelectSpecController],
    [MY_ORDERS, OrdersController],
    // Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});

router.setUp();
router.start();
