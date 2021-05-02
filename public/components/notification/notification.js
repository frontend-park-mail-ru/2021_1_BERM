export const notification = (data) => {
    const not = document.createElement('not');
    not.id = 'notification';

    const move = () => {
        not.style.transitionDuration = '500ms';
        not.style.transitionTimingFunction =
            'cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        not.style.opacity = '0.5';
        setTimeout(() => {
            not.style.opacity = '0.4';
        }, 100);
        setTimeout(() => {
            not.style.opacity = '0.3';
        }, 200);
        setTimeout(() => {
            not.style.opacity = '0.2';
        }, 300);
        setTimeout(() => {
            not.style.opacity = '0.1';
        }, 400);
        setTimeout(() => {
            not.style.opacity = '0';
            if (document.querySelector('#notification') !== null) {
                not.parentNode.removeChild(not);
            }
        }, 500);
    };

    if (typeof data === 'string') {
        not.addEventListener('click', (e) => {
            move();
        });
    }

    if (typeof data === 'string') {
        setTimeout( () => {
            move();
        }, 2500);
    }

    not.textContent = data;

    document.body.appendChild(not);
};
