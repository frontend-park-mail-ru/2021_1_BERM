function pug_attr(t,e,n,r){if(!1===e||null==e||!e&&("class"===t||"style"===t))return"";if(!0===e)return" "+(r?t:t+'="'+t+'"');var f=typeof e;return"object"!==f&&"function"!==f||"function"!=typeof e.toJSON||(e=e.toJSON()),"string"==typeof e||(e=JSON.stringify(e),n||-1===e.indexOf('"'))?(n&&(e=pug_escape(e))," "+t+'="'+e+'"'):" "+t+"='"+e.replace(/'/g,"&#39;")+"'"}
function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function navbarTemplate(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (authorized, profIcon) {pug_mixins["navbarContent"] = pug_interp = function(){
var block = (this && this.block), attributes = (this && this.attributes) || {};
if (authorized) {
pug_html = pug_html + "\u003Ca class=\"navbar_icon\" href=\"#\u002Fprofile\"\u003E\u003Cimg" + (" class=\"icon\""+pug_attr("src", profIcon, true, false)) + "\u002F\u003E\u003C\u002Fa\u003E\u003Ca href=\"#\u002ForderPage\"\u003EРазместить заказ\u003C\u002Fa\u003E";
}
else {
pug_html = pug_html + "\u003Ca href=\"#\u002Flogin\"\u003EВход\u003C\u002Fa\u003E\u003Cdiv class=\"navbar__registration\"\u003E\u003Ca class=\"navbar__registration_btn\"\u003EРегистрация\u003C\u002Fa\u003E\u003Cdiv class=\"navbar__registration_content\"\u003E\u003Ca href=\"#\u002FclientReg\"\u003EЗа клиента\u003C\u002Fa\u003E\u003Ca href=\"#\u002FworkerReg\"\u003EЗа исполнителя\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";
}
pug_html = pug_html + "\u003Cdiv class=\"navbar__button_title\"\u003E\u003Ca class=\"active\" href=\"#\u002F\"\u003EFL\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E";
};
pug_html = pug_html + "\u003Cdiv class=\"navbar\" id=\"myTopnav\"\u003E\u003Cdiv class=\"main__container\"\u003E\u003Cdiv class=\"main__container_center\"\u003E";
pug_mixins["navbarContent"]();
pug_html = pug_html + "\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E";}.call(this,"authorized" in locals_for_with?locals_for_with.authorized:typeof authorized!=="undefined"?authorized:undefined,"profIcon" in locals_for_with?locals_for_with.profIcon:typeof profIcon!=="undefined"?profIcon:undefined));;return pug_html;}