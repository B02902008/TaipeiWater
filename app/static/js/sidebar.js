$(document).ready(function () {
    $('#sidebar-btn').click(function () {
        toggle_sidebar();
        $('#sidebar-btn').blur();
    });
    $('#sidebar-overlay').click(function () {
        toggle_sidebar();
    });
    $('#menu-show_all').addClass("menu-selected");
    $('.menu-list-item').click(function () {
        $('.menu-list-item').removeClass("menu-selected");
        this.addClass("menu-selected");
    })
});
function toggle_sidebar() {
    $('#sidebar-overlay').toggle();
    $('#sidebar-wrapper').toggleClass('toggled');
    $('#sidebar-btn-content').toggleClass('glyphicon-menu-hamburger');
    $('#sidebar-btn-content').toggleClass('glyphicon-remove');
}