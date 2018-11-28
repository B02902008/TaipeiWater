'use strict'
$(document).ready(function () {
	$('#login-panel-form').submit(function () {
        let username = $('#login-panel-form input[name=usr]').val();
        let password = $('#login-panel-form input[name=pwd]').val();
        if (!login_validate(username, password))
            return false;
        $.ajax({
			url: "/user/login",
            type: "POST",
			dataType: "JSON",
            async: false,
			data: {
				username: username,
				password: password
			},
			success: function(response) {
				if (response.success) {
				    let obj = response.msg;
                    setCookie('token', obj.token, 7);
				    window.uid = obj.uid;
				    window.help = obj.help;
				    window.login = true;
				    window.state = "show";
                } else {
				    alert(response.msg);
                }
            },
			error: function(response) {
				console.log(response);
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
        if (password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/i) == null) {
            alert("密碼錯誤！");
            return false;
        }
        return true;
    }
});