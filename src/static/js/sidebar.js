$(document).ready(function () {
    $('#sidebar-btn').click(function () {
        toggle_sidebar();
        $('#sidebar-btn').blur();
    });
    $('#sidebar-overlay').click(function () {
        toggle_sidebar();
    });
    function toggle_sidebar() {
        $('#sidebar-overlay').toggle();
        $('#sidebar-wrapper').toggleClass('toggled');
        $('#sidebar-btn-content').toggleClass('glyphicon-menu-hamburger');
        $('#sidebar-btn-content').toggleClass('glyphicon-remove');
    }
});