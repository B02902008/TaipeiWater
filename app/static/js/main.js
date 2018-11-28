$(document).ready(function () {
    window.login = false;
	window.uid = -1;
	window.state = 'login';
	$('#sidebar-container').load("/load/sidebar");
	$('#panel-container').load("/load/panel");
});
function toggle_panel() {
	$('#panel-container').toggle();
}