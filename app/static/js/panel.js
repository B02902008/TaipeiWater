$(document).ready(function () {
    load_login();
});
function load_login() {
    $('#control-panel').load("/load/login");
}
function load_register() {
    $('#control-panel').load("/load/register");
}