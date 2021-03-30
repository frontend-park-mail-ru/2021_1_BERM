import {Controller} from './controller.js';
import {WorkerRegView} from '../views/workerRegView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";

export class WorkerRegController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new WorkerRegView(),
            [
                ['work_registered', this._onRegCl],
                ['work_registered-submit', this._submitRegCl],
            ]);
    }

    _onRegCl(res) {
        if (res.status === 200 || res.status === 201) {
            router.go('main-page');
        } else {
            eventBus.emit('page not found 404');
        }
    }

    _submitRegCl(info) {
        auth.reg(info);
    }
}