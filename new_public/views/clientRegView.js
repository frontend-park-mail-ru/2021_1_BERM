import {View} from './view.js';
import {ValidationView} from './validationView.js'

// import eventBus from "../modules/eventBus.js";

export class ClientRegView extends View {
    render() {
        console.log('REEEEEEEEEEEEEG')

        const root = document.getElementById('root');
        root.innerHTML = navbarTemplate() + clientregTemplate();

        let val = new ValidationView();
        val.validate();

        // const form = document.getElementById('login__window');
        //
        // root.addEventListener('keyup', (event) => {
        //     if(event.keyCode === 13) { //  Enter
        //         form.submit();
        //     }
        // });
        //
        // form.addEventListener('submit', (event) => {
        //     const data = {
        //         email: event.target.email.value,
        //         password: event.target.password.value,
        //     };
        //
        //
        //     eventBus.emit('login-submit', data);
        // });
        //
        // this.listeners = new Set([
        //     ['no-login', this._onNoLogin],
        // ]);
        //
        // super.onAll()
    }


}