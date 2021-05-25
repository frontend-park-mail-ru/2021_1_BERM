export class Rerender {
    constructor(template) {
        this.template = template;
    }

    update(parentNodeSelector, dataForRender) {
        const parentNode = document.querySelector(parentNodeSelector);
        while (parentNode.firstChild) {
            parentNode.removeChild(parentNode.firstChild);
        }
        debugger;
        console.log(dataForRender);
        parentNode.innerHTML = this.template(dataForRender);
    }

    deleteById(id) {
        const element = document.getElementById(id);
        if (element !== null) {
            element.remove();
        }
    }

    addById(id, parentNodeSelector, dataForRender, template) {
        debugger;
        const parentNode = document.querySelector(parentNodeSelector);
        parentNode.insertAdjacentHTML('beforeEnd', template(dataForRender));
    }
}
