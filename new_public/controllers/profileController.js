import {Controller} from "./controller.js"
import auth from '../models/Auth.js'
import eventBus from "../modules/eventBus.js"
import user from "../models/User.js"
import {ProfileView} from "../views/profileView.js";
import router from "../modules/router.js";


export class ProfileController extends Controller {
    constructor() {
        super();
    }

    run() {
        if (!user.isAuthorized) {
            router.go('login');
            return;
        }

        super.run(
            new ProfileView(),
            [
                ['profile', this._Profile],
                ['onProfile', this._onProfile],
                ['change-image', this._changeImage],
                ['load-image', this._onLoadImage],
                ['exit', this._onExit],
            ]);
    }

    emitRender() {

    }

    _Profile() {
        if (!user.isGetAttr) {
            auth.getProfile(user.id);
        } else {
            eventBus.emit('render-profile', {
                name: user.name,
                nickName: user.nickName,
                isExecutor: user.isExecutor,
                specialize: user.specializes,
                about: user.about,
                img: user.img,
            });
        }
    }

    _onProfile(res) {
        if (res.status !== 200) {
            // ToDo: Косяк
            console.log("Косяк");
            return;
        }
        res.json()
            .then((res) => {
                const data = {
                    name: res.first_name + ' ' + res.second_name,
                    nickName: res.user_name,
                    isExecutor: res.executor,
                    specialize: res.specializes,
                    about: res.about,
                    img: res.img_url,
                };

                user.setAttributes(data);

                eventBus.emit('render-profile', {
                    name: user.name,
                    nickName: user.nickName,
                    isExecutor: user.isExecutor,
                    specialize: user.specializes,
                    about: user.about,
                    img: user.img,
                });
            });
    }

    _changeImage(src) {
        auth.sendImage(src);
    }

    _onLoadImage({res, src}) {
        if (res.status === 200 || res.status === 201) {
            eventBus.emit('success-load-image', src);
        } else {
            eventBus.emit('fail-load-image');
        }
    }

    _onExit() {
        auth.logout();
        user.isAuthorized = false;
        user.isGetAttr = false;
        router.go('main-page');
    }
}