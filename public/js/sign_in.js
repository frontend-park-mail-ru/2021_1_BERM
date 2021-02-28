const application = document.getElementById('app');

function signIn() {
    application.innerHTML = '';
    application.innerHTML = sign();
}

signIn()