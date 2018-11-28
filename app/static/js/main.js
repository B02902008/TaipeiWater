$(document).ready(function () {
	window.uid = -1;
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
                console.log(response)
            },
            error: function(response) {
                console.log(response);
            }
        });
	} else {
        window.login = false;
        window.state = 'login';
	}
	$('#sidebar-container').load("/load/sidebar");
	$('#panel-container').load("/load/panel");
});
function toggle_panel() {
	$('#panel-container').toggle();
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