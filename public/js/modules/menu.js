    /* Когда пользователь нажимает на кнопку,
переключение между скрытием и отображением раскрывающегося содержимого */
 export default {
    runMenu() {
    
        document.getElementById("myDropdown").classList.toggle("show");
      
      
      // Закройте выпадающее меню, если пользователь щелкает за его пределами
      window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {
          var dropdowns = document.getElementsByClassName("dropdown-content");
          var i;
          for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
            }
          }
        }
      } 
  }}