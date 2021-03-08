import Controller from './controller.js'

function addHandle() {
    const body = Array.from(document.getElementsByTagName('a'));
    for(let i = 0; i < body.length; ++i) {
        body[i].addEventListener('click', (event) => {
            event.preventDefault();
            const hash = body[i].getAttribute('href');
            console.log(location.pathname + hash)
            // window.history.pushState(
            //     null,
            //     document.title,
            //     hash
            // );
            location.hash = hash;

            Controller[hash.slice(1) + 'Route']();
            addHandle();
        })
    }
}

export default {
    init() {
        // window.history.pushState(
        //     null,
        //     document.title,
        //     '/'
        // );

        Controller[location.hash.slice(2) + 'Route']();
        addHandle();
    }
}