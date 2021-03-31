import {View} from "./view.js";

import indexTemplate from "@/templates/index.pug"

export class MainPageView extends View {
    render() {
        super.renderHtml(
            indexTemplate(),
            []
        );
    }
}