import {Controller} from './controller.js';
import user from '@/models/User.js';
import router from '@/modules/router.js';
import auth from '@/models/Auth.js';
import {SelectSpecView} from '@/views/selectSpecView';
import {
    NOT_SET_CATEGORY,
    SELECT_SPEC_SELECTED,
    SELECT_SPEC_SET,
} from '@/modules/utils/actions';
import eventBus from '@/modules/eventBus.js';
import {getProfilePath, getWorkerRegPath} from '@/modules/utils/goPath.js';

/** Страница выбора специализации */
export class SelectSpecController extends Controller {
    /**
     * Конструктор
     */
    constructor() {
        super();
        this.view = new SelectSpecView();
    }

    /**
     * Запуск контроллера страницы выбора специализации
     *
     * @param {number} id - id из url, если он там был
     */
    run(id) {
        super.run(
            [
                [SELECT_SPEC_SELECTED, this._selected.bind(this)],
                [SELECT_SPEC_SET, this._set.bind(this)],
            ],
            false,
            true);
    }

    /**
     * Сохраняем выбранную специализацию
     *
     * @param {string} spec - специализация
     */
    _selected({spec}) {
        this.spec = spec;
        if (!user.isAuthorized) {
            user.spec = spec;
            router.go(getWorkerRegPath);
        } else {
            auth.setSpec(user.id, {name: spec});
        }
    }

    /**
     * Обрабатываем ответ на запрос о установке специализации
     *
     * @param {Response} res - ответ на установку специализации
     */
    _set(res) {
        if (res.ok) {
            user.specializes.push(this.spec);
            router.go(getProfilePath(user.id));
        } else {
            eventBus.emit(NOT_SET_CATEGORY);
        }
    }
}
