const application = document.getElementById('client_reg');
const clk = document.getElementById('clk_cl')

// function RegPage() {
//     application.innerHTML = '';
//     application.innerHTML = template();
// }

clk.onclick = function() {
    application.innerHTML = '';
    application.innerHTML = cl_reg();
}

// profilePage();
//RegPage();