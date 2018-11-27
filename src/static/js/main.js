$(document).ready(function () {
	$('#sidebar-container').load("/load-sidebar");
	$('#panel-container').load("/load-panel");
});
function toggle_panel() {
	$('#panel-container').toggle();
}