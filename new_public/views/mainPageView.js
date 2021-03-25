import {View} from "./view.js";

export class MainPageView extends View {
    render() {
        super.renderHtml(
            navbarTemplate() + indexTemplate(),
            []
        );
    }
}