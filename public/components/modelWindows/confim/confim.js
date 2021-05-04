import conf from '@/components/modelWindows/confim/confim.pug';

export const confim = (callbackYes) => {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('scroll_hidden');

    const root = document.getElementById('root');
    root.insertAdjacentHTML('beforeend', conf());

    const elem = document.getElementById('confim_window');

    const bg = document.querySelector('.orderPage__feedback_bg');
    bg.addEventListener('click', (event) => {
        bg.remove();
    });

    const window = document.querySelector('.orderPage__feedback_window');
    window.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const no = document.querySelector('.mini-button__elem_no');
    no.addEventListener('click', (event) => {
        event.preventDefault();
        elem.parentNode.removeChild(elem);
        body.classList.remove('scroll_hidden');
    }, {once: true});

    const yes = document.querySelector('.mini-button__elem_yes');
    yes.addEventListener('click', callbackYes, {once: true});
    yes.addEventListener('click', () => {
        window.parentNode.removeChild(window);
        body.classList.remove('scroll_hidden');
    }, {once: true});
};
