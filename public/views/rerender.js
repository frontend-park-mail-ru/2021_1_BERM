export class Rerender {
    constructor(template) {
        this.template = template;
    }

    update(parentNode, dataForRender) {
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
        parentNode.innerHTML = this.template(dataForRender);
    }
}
