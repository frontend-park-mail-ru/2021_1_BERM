import {BaseMVC} from '@/modules/baseMVC';
import user from '@/models/User.js';
import router from '@/modules/router.js';
import {getLoginPath, getProfilePath} from '@/modules/utils/goPath.js';

/** Родительский класс, от которого наследуются остальные контроллеры.
 * Осуществляет взаимодействие между моделями и view  */
export class Controller extends BaseMVC {
    /**
     * Валидации при срабатывании нажатия кнопки
     *
     * @param {Array} listenersArr - массив слушателей
     * @param {Boolean } goLogin - Требуется ли авторизация
     * @param {Boolean } anyGo - Безразлична ли авторизация
     * для перехода на эту страницу
     */
    run(listenersArr, goLogin = false, anyGo = false) {
        if (goLogin && !user.isAuthorized && !anyGo) {
            router.go(getLoginPath);
            return;
        }

        if (!goLogin && user.isAuthorized && !anyGo) {
            router.go(getProfilePath(user.id));
            return;
        }

        this.listeners = listenersArr;

        super.onAll();
        this.view.render(user.isAuthorized, user.isExecutor);
    }
}
