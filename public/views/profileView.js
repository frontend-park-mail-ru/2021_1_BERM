import {View} from "./view.js";
import eventBus from "../modules/eventBus.js";
import {EXIT, FAIL_LOAD_IMG, IMG_CHANGE, PROFILE, RENDER_PROFILE, SUCCESS_LOAD_IMG} from "../modules/utils/actions.js";

export class ProfileView extends View {
    render() {
        super.setListeners([
            [RENDER_PROFILE, this._renderProfile],
            [SUCCESS_LOAD_IMG, this._successLoadImage],
            [FAIL_LOAD_IMG, this._failLoadImage],
        ]);

        eventBus.emit(PROFILE);
    }

    _renderProfile(info) {
        super.renderHtml(
            profileTemplate(info)
        );


        let img = document.getElementById('profile_img');
        if (info.img === null || info.img === undefined) {
            img.src = 'static/img/profile.jpg';
        } else {
            img.src = info.img;
        }


        const inputImg = document.getElementById('file-input');
        inputImg.onchange = async (ev) => {
            const file = ev.target.files[0];
            const fReader = new FileReader();
            fReader.onload = () => {
                eventBus.emit(IMG_CHANGE, fReader.result);
            };
            await fReader.readAsDataURL(file);
        }

        const exitLink = document.getElementById('profile__exit_link');
        exitLink.addEventListener('click', () => {
            eventBus.emit(EXIT);
        })
    }

    _successLoadImage(src) {
        let img = document.getElementById('profile_img');
        img.src = src;
    }

    _failLoadImage() {
        // ToDo: Отобразить. Не удалось загрузить изображение
        console.log('Не удалось загрузить изображение');
    }
}