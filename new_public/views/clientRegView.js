import {View} from './view.js';
import {ValidationView} from './validationView.js'

export class ClientRegView extends View {
    render() {
        super.renderHtml(navbarTemplate() + clientregTemplate());

        let val = new ValidationView();
        val.validate();
    }
}