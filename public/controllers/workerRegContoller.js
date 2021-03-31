import {Controller} from './controller.js';
import {WorkerRegView} from '../views/workerRegView.js';

import eventBus from "../modules/eventBus.js";
import router from "../modules/router.js";
import auth from "../models/Auth.js";
import {NO_REG_WORKER, REG, WORKER_REG_SUBMIT} from "../modules/utils/actions.js";

export class WorkerRegController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new WorkerRegView(),
            [
                [REG, this._onRegCl],
                [WORKER_REG_SUBMIT, this._submitRegCl],
            ]);
    }

    _onRegCl(res) {
        if (res.ok) {
            router.go('main-page');
        } else {
            eventBus.emit(NO_REG_WORKER);
        }
    }

    _submitRegCl(info) {
        auth.reg(info);
    }
}