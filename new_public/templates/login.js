function loginTemplate(locals) {
    var pug_html = "", pug_mixins = {}, pug_interp;
    pug_html = pug_html + "\u003Cdiv class=\"login__content\"\u003E\u003Cform class=\"login__window\" id=\"login__window\"\u003E\u003Cdiv class=\"login__window_label\"\u003EВход\u003C\u002Fdiv\u003E\u003Cdiv class=\"login__error\"\u003E\u003C\u002Fdiv\u003E\u003Cinput class=\"login__window_login\" name=\"email\" placeholder=\"Почта\" type=\"text\"\u002F\u003E\u003Cinput class=\"login__window_password\" name=\"password\" placeholder=\"Пароль\" type=\"password\"\u002F\u003E\u003Cinput class=\"login__window_enter\" type=\"submit\" value=\"Войти\"\u002F\u003E\u003Ca class=\"login__window_forgot-pass\"\u003EЗабыли свой пароль?\u003C\u002Fa\u003E\u003C\u002Fform\u003E\u003C\u002Fdiv\u003E";
    ;
    return pug_html;
}