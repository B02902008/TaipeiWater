'use strict';
$(document).ready(function () {
    window_reset();
	window.token = getCookie('token');
	$('#panel-container').load("/load/panel");
	$('#sidebar-container').load("/load/sidebar");
	if ( window.token != null) {
        $.ajax({
            url: "/user/token",
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {
                token: window.token,
            },
            success: function(response) {
                if (response.success) {
                    let obj = response.msg;
                    setCookie('token', obj.token, 7);
                    window.uid = obj.uid;
                    window.help = obj.help;
                    window.token = obj.token;
                    window.view_type = obj.view_type;
                    window.view_status = obj.view_status;
                    window.view_range = obj.view_range;
                    window.login = true;
                    window.state = "show";
                    page_control();
                } else {
                    alert(response.msg);
                    page_control();
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
	} else {
        page_control();
	}
});
function window_reset() {
    window.uid = -1;
    window.help = false;
    window.token = '';
    window.view_type = '';
    window.view_status = '';
    window.view_range = 0;
    window.login = false;
    window.state = "login";
}
function hide_panel() {
    $('#panel-container').hide();
}
function show_panel() {
    $('#panel-container').show();
}
function hide_sidebar() {
    $('#sidebar-container').hide();
}
function show_sidebar() {
    $('#sidebar-container').show();
}
function setCookie(name, value, expire) {
    let d = new Date();
    d.setTime(d.getTime() + (expire * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + d.toUTCString();
}
function getCookie(name) {
    let key = name + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0 ; i < cookies.length ; i ++) {
        let c = cookies[i].trim();
        if (c.indexOf(key) == 0)
        	return c.substring(key.length, c.length);
    }
    return null;
}
function page_control() {
	switch (window.state) {
		case "login":
		    show_panel();
		    hide_sidebar();
		    if (typeof window.load_login === "function") {
                load_login();
            }
            break;
		case "register":
		    show_panel();
		    hide_sidebar();
            load_register();
            break;
		case "show":
		    hide_panel();
		    show_sidebar();
            break;
		case "setting":
		    show_panel();
		    show_sidebar();
            break;
		default:
			break;
    }
}