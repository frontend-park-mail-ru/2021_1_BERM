import {View} from './view.js';
import {ValidationView} from './validationView.js'

export class ClientRegView extends View {
    render() {
        super.renderHtml(
            clientregTemplate(),
            [
            ['no-registration', this._onNoRegistration],
        ]);

        let val = new ValidationView();
        val.validate();
    }

    _onNoRegistration() {
        // ToDo(Алексей Егоров): Пользователь с такой почтой уже зарегистрирован
        console.log('sorry, this invalid email');
    }
}