'use strict';
$(document).ready(function () {
    window_reset();
	$('#panel-container').load("/load/panel", function () {
        $('#sidebar-container').load("/load/sidebar", function () {
            login_token();
        });
    });
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
    window.data_raw = [];
    window.data_filter = [];
    window.data_view = [];
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
function login_token() {
    window.token = getCookie('token');
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
                    window.state = "init";
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
}
function data_request() {
    $.ajax({
        url: "/util/data",
        type: "GET",
        dataType: "JSON",
        async: false,
        data: {},
        success: function(response) {
            if (response.success) {
            } else {
                alert(response.msg);
            }
        },
        error: function(response) {
            console.log(response);
        }
    });
}
function page_control() {
	switch (window.state) {
		case "login":
            load_login();
		    show_panel();
		    hide_sidebar();
            break;
		case "register":
            load_register();
		    show_panel();
		    hide_sidebar();
            break;
		case "init":
		    data_request();
		    initial_sidebar();
		    hide_panel();
		    show_sidebar();
            break;
		case "setting":
		    clear_panel();
            load_setting();
		    show_panel();
		    show_sidebar();
            break;
		case "clear":
		    clear_panel();
		    hide_panel();
		    show_sidebar();
            break;
		default:
			break;
    }
}