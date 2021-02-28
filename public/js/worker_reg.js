const application = document.getElementById('worker_reg');
const clk = document.getElementById('clk')

// function RegPage() {
//     application.innerHTML = '';
//     application.innerHTML = template();
// }

clk.onclick = function() {
    application.innerHTML = '';
    application.innerHTML = template();
}

// profilePage();
//RegPage();