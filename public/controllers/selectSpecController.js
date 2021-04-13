import {Controller} from './controller.js';
import user from '../models/User.js';
import router from '../modules/router.js';
import auth from '../models/Auth.js';
import {SelectSpecView} from '../views/selectSpecView.js';
import {
    SELECT_SPEC_SELECTED,
    SELECT_SPEC_SET,
} from '../modules/utils/actions.js';

export class SelectSpecController extends Controller {
    constructor() {
        super();
        this.view = new SelectSpecView();
    }

    run(id) {
        super.run(
            [
                [SELECT_SPEC_SELECTED, this._selected.bind(this)],
                [SELECT_SPEC_SET, this._set.bind(this)],
            ],
            false,
            true);
    }

    _selected({spec}) {
        this.spec = spec;
        if (!user.isAuthorized) {
            user.spec = spec;
            router.go('/worker-reg');
        } else {
            auth.setSpec(user.id, {specialize: spec});
        }
    }

    _set(res) {
        if (res.ok) {
            user.specializes.push(this.spec);
            router.go(`/profile/${user.id}`);
        } else {
            console.log('Не удалось добавить специализацию');
            // Todo Add
        }
    }
}
