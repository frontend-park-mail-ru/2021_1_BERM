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
import './static/scss/vacancy.scss';
import './static/scss/notti.scss';
import './static/scss/reviews.scss';
import './static/scss/search.scss';
import './static/scss/confim.scss';
import './static/scss/page404.scss';

import './static/mediaSccs/orderMedia.scss';
import './static/mediaSccs/rootMedia.scss';
import './static/mediaSccs/settingsMedia.scss';
import './static/mediaSccs/registrationMedia.scss';
import './static/mediaSccs/profileMedia.scss';
import './static/mediaSccs/ordersMedia.scss';
import './static/mediaSccs/navbarMedia.scss';

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
import {VacanciesController} from '@/controllers/vacanciesController';
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
    VACANCIES_PAGE,
    NOT_FOUND,
    ARCHIVE,
    REVIEWS,
    MY_VACANCIES,
} from './modules/constants/pageNames.js';
import {Page404Controller} from '@/controllers/page404Controller.js';
import {ReviewsController} from '@/controllers/reviewsController';

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js')
//         .then((registration) => {
//             console.log('sw registration on scope:', registration.scope);
//         })
//         .catch((err) => {
//             console.error(err);
//         });
// }

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
    [MY_VACANCIES, VacanciesController],
    [VACANCIES_PAGE, VacanciesController],
    [ARCHIVE, OrdersController],
    [REVIEWS, ReviewsController],
    [NOT_FOUND, Page404Controller],
    // Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});

router.start();
