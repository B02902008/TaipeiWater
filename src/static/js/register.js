$(document).ready(function () {
    $('#register-panel-form').submit(function () {
        var username = $('#register-panel-form input[name=usr]').val(),
            password = $('#register-panel-form input[name=pwd]').val(),
            confirm = $('#register-panel-form input[name=confirm]').val(),
            helper = $('#register-panel-form input[name=help]').prop("checked");
        if (!register_validate(username, password, confirm, helper))
            return false;
        load_login();
        return false;
    });
    function register_validate(username, password, confirm, helper) {
        if (username === '' || password === '' || confirm ==='') {
            alert("有欄位為空白！");
            return false;
        }
        if (password !== confirm) {
            alert("兩次密碼不一致！");
            return false;
        }
        console.log(username, password, confirm, helper);
        return true;
    }
});