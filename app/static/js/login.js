'use strict'
$(document).ready(function () {
	$('#login-panel-form').submit(function () {
        let username = $('#login-panel-form input[name=usr]').val();
        let password = $('#login-panel-form input[name=pwd]').val();
        if (!login_validate(username, password))
            return false;
        $.ajax({
			url: "/login",
            type: "POST",
			dataType: "JSON",
            async: false,
			data: {
				username: username,
				password: password
			},
			success: function(msg) {
				console.log(msg)
            },
			error: function(msg) {
				console.log(msg);
            }
		});
        return false;
	});
    $('#login-panel-register').click(function () {
        load_register();
    });
    $('#login-panel-visit').click(function () {
        load_register();
    });
    function login_validate(username, password) {
        if (username === '' || password === '') {
            alert("有欄位為空白！");
            return false;
        }
        console.log(username, password);
        return true;
    }
});