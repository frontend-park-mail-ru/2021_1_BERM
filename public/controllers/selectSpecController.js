import {Controller} from './controller.js';
import user from '../models/User.js';
import router from '../modules/router.js';
import {SelectSpecView} from '../views/selectSpecView.js';
import {
    SELECT_SPEC_SELECTED,
} from '../modules/utils/actions.js';

export class SelectSpecController extends Controller {
    constructor() {
        super();
        this.view = new SelectSpecView();
    }

    run(id) {
        super.run(
            [
                [SELECT_SPEC_SELECTED, this._selected],
            ],
            false,
            true);
    }

    _selected({spec}) {
        user.spec = spec;

        router.go('/worker-reg');
    }
}
