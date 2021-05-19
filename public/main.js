import '@/components/pages/index/main_page.scss';
import '@/components/pages/login/login.scss';
import '@/static/scss/valid.scss';
import '@/components/pages/orders/orders.scss';
import '@/components/pages/selectSpec/selectSpec.scss';
import '@/static/scss/select.scss';
import '@/components/navbars/navbar_executor.scss';
import '@/static/scss/root.scss';
import '@/components/navbars/navbar.scss';
import '@/components/pages/profile/profile.scss';
import '@/components/pages/settings/settings.scss';
import '@/components/pages/registration/registration.scss';
import '@/components/pages/order/orderPage.scss';
import '@/components/pages/vacancy/vacancy.scss';
import '@/components/notification/notti.scss';
import '@/components/pages/reviews/reviews.scss';
import '@/components/pages/orders/search.scss';
import '@/components/pages/search/search.scss';
import '@/components/modelWindows/confim/confim.scss';
import '@/components/pages/404/page404.scss';
import '@/components/pages/createOrderVacancy/createOrderOrVacancy.scss';

import '@/static/mediaSccs/selectMedia.scss';
import '@/static/mediaSccs/orderMedia.scss';
import '@/static/mediaSccs/vacancyMedia.scss';
import '@/static/mediaSccs/templatesMedia.scss';
import '@/static/mediaSccs/settingsMedia.scss';
import '@/static/mediaSccs/registrationMedia.scss';
import '@/static/mediaSccs/profileMedia.scss';
import '@/static/mediaSccs/ordersMedia.scss';
import '@/static/mediaSccs/navbarMedia.scss';
import '@/static/mediaSccs/mainMedia.scss';
import '@/static/mediaSccs/feedbackMedia.scss';
import '@/static/mediaSccs/createOrderOrVacancyMedia.scss';
import '@/static/mediaSccs/rootMedia.scss';

import {
    LoginController,
} from '@/controllers/loginController.js';
import {
    ClientRegController,
} from '@/controllers/clientRegController.js';
import {
    WorkerRegController,
} from '@/controllers/workerRegContoller.js';
import {
    SettingsController,
} from '@/controllers/settingsController.js';
import {
    OrderCreateController,
} from '@/controllers/orderCreateContoller.js';
import {
    VacancyCreateController,
} from '@/controllers/vacancyCreateController.js';

import router from '@/modules/router.js';
import {
    MainPageController,
} from '@/controllers/mainPageController.js';
import {
    ProfileController,
} from '@/controllers/profileController.js';
import {
    OrderPageController,
} from '@/controllers/orderPageController.js';
import {
    OrdersController,
} from '@/controllers/ordersContoller.js';
import {
    VacancyPageController,
} from '@/controllers/vacancyPageController.js';
import {
    SelectSpecController,
} from '@/controllers/selectSpecController.js';
import {
    VacanciesController,
} from '@/controllers/vacanciesController';
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
    MY_VACANCIES, SEARCH_PAGE,
} from '@/modules/constants/pageNames.js';
import {
    Page404Controller,
} from '@/controllers/page404Controller.js';
import {
    ReviewsController,
} from '@/controllers/reviewsController';
import {SearchController} from '@/controllers/searchController';

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
    [SEARCH_PAGE, SearchController],
    // Здесь добавляем странички
]);

controllers.forEach((value) => {
    router.register(value[0], value[1]);
});

router.start();
