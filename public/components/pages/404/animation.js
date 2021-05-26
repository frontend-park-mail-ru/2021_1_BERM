export const starAnimation = () => {
    const body = document.querySelector('.page404');

    setInterval(createStar, 100);

    /** Создание звезды */
    function createStar() {
        let right = Math.random() * 500;
        const top = Math.random() * screen.height;
        const star = document.createElement('div');
        star.classList.add('star');
        body.appendChild(star);
        setInterval(runStar, 10);
        star.style.top = top + 'px';

        /** Движение звезды */
        function runStar() {
            if (right >= screen.width) {
                star.remove();
            }
            right += 3;
            star.style.right = right + 'px';
        }
    }
};
