import {Controller} from "./controller.js";
import {MainPageView} from "../views/mainPageView.js";

export class MainPageController extends Controller {
    constructor() {
        super();
    }

    run() {
        super.run(
            new MainPageView(),
            []);
    }
}