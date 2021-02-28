const application = document.getElementById('worker_reg');
const clk = document.getElementById('clk')



clk.onclick = function() {
    application.innerHTML = '';
    application.innerHTML = wrk_reg();
}

