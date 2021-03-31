const root = document.getElementById('root');

let saveData = {
    id: 0,
    img: 'img/icon.png',
};

export default {
    viewMainPage() {
        root.innerHTML = navbarTemplate({
            authorized: true,
            profIcon: saveData.img
        }) + indexTemplate();
    },

    viewSignIn() {
        root.innerHTML = navbarTemplate() + signinTemplate();
    },

    viewClientReg() {
        root.innerHTML = navbarTemplate() + clientregTemplate();
    },

    viewWorkerReg() {
        root.innerHTML = navbarTemplate() + workerregTemplate();
    },

    viewProfile(profileInfo) {
        root.innerHTML = navbarTemplate({
            authorized: true,
            profIcon: saveData.img
        }) + profileTemplate(profileInfo);
    },

    viewSetting(profileSettings) {
        root.innerHTML = navbarTemplate({
            authorized: true,
            profIcon: saveData.img
        }) + settingsTemplate(profileSettings);
    },

    viewOrderPage() {
        root.innerHTML = navbarTemplate({
            authorized: true,
            profIcon: saveData.img
        }) + orderpageTemplate();
    }
}
