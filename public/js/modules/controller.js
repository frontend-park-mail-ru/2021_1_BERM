const root = document.getElementById('root');

export default {
    Route() {
        document.title = 'FL.ru';

        root.innerHTML = navbarTemplate() + indexTemplate();
    },

    loginRoute() {
        document.title = 'Авторизация';

        root.innerHTML = navbarTemplate() + signinTemplate();
    },

    clientRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + clientregTemplate();
    },

    workerRegRoute() {
        document.title = 'Регистрация';

        root.innerHTML = navbarTemplate() + workerregTemplate();
    },

    profileRoute() {
        const profileInfo = {
            profileImgUrl: "img/profile.jpg",
            settingImgUrl: "img/settings.png",
            rateImgUrl: "img/rate.png",
            reviewsImgUrl: "img/reviews.png",
            orderImgUrl: "img/order.png",
            name: "Олег Реуцкий",
            nickName: "astlok",
            specialize: "Мобильная разработка",
            reviews: {
                all: 25,
                good: 20,
                bad: 5,
            },
            rating: 5,
            totalOrders: 30,
            about: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ut non eaque veniam quisquam temporibus nihil id " +
                "tempora rerum, cumque, aliquid voluptatem nemo cum hic reiciendis obcaecati laudantium fuga quia aperiam. " +
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat impedit cumque voluptate pariatur ipsam " +
                "expedita temporibus! Dolore inventore veritatis iusto quisquam, laboriosam soluta provident aliquid illum, " +
                "numquam similique ea voluptate. Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae fugit accusamus " +
                "aliquam enim molestias voluptatem ipsa Yarik davai delay rekursiy quam voluptatum quibusdam cupiditate, ex eius. Accusamus voluptate " +
                "veritatis laudantium similique cumque, numquam dolor. Lorem ipsum dolor sit, amet consectetur adipisicing elit. " +
                "Repellat eos unde dolores ab explicabo eveniet dolorum voluptates quam nesciunt pariatur? Sit iste consectetur, " +
                "harum ex commodi repellat porro velit ut."
        } // Временная структура

        document.title = 'Профиль';

        root.innerHTML = navbarTemplate() + profileTemplate(profileInfo);
    }
};