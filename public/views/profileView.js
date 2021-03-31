import {View} from "./view.js";
import eventBus from "../modules/eventBus.js";

import profileTemplate from "@/templates/profile.pug"

export class ProfileView extends View {
    render() {
        super.setListeners([
            ['render-profile', this._renderProfile],
            ['success-load-image', this._successLoadImage],
            ['fail-load-image', this._failLoadImage],
        ]);

        eventBus.emit('profile');
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
                eventBus.emit('change-image', fReader.result);
            };
            await fReader.readAsDataURL(file);
        }

        const exitLink = document.getElementById('profile__exit_link');
        exitLink.addEventListener('click', () => {
            eventBus.emit('exit');
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