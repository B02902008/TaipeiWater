$(document).ready(function () {
	$('#sidebar-container').load("sidebar.html");
	$('#panel-container').load("panel.html");
});
function toggle_panel() {
	$('#panel-container').toggle();
}