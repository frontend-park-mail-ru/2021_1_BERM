function navbar(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_mixins["navbarContent"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
pug_html = pug_html + "\u003Ca href=\"#workerReg\"\u003EРегистрация\u003C\u002Fa\u003E\u003Ca href=\"#login\"\u003EВход\u003C\u002Fa\u003E\u003Cbutton class=\"navbar__button_order\"\u003EРазместить заказ\u003C\u002Fbutton\u003E\u003Cdiv class=\"navbar__button_title\"\u003E\u003Ca class=\"active\" href=\"#\"\u003EFL\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
};
pug_html = pug_html + "\u003Cdiv class=\"navbar\" id=\"myTopnav\"\u003E\u003Cdiv class=\"main__container\"\u003E\u003Cdiv class=\"main__container_center\"\u003E";
pug_mixins["navbarContent"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";;return pug_html;}