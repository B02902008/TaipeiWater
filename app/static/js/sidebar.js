$(document).ready(function () {
    initial_sidebar();
    $('#sidebar-btn').click(function () {
        toggle_sidebar();
        $('#sidebar-btn').blur();
    });
    $('#sidebar-overlay').click(function () {
        toggle_sidebar();
    });
    $('.menu-list-item').click(function (event) {
        $('.menu-list-item').removeClass("menu-selected");
        $(event.target.parentElement).addClass("menu-selected");
        toggle_sidebar();
    });
    $('#menu-setting').click(function () {
        window.state = "setting";
        page_control();
    });
    $('#menu-logout').click(function () {
        $.ajax({
            url: "/user/logout",
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {
                uid: window.uid,
                token: window.token
            },
            success: function(response) {
                if (response.success) {
                    setCookie('token', '', -1);
                    window_reset();
                    initial_sidebar();
                    page_control();
                } else {
                    alert(response.msg);
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
    });
});
function initial_sidebar() {
    if (!window.login) {
        $('#menu-report').hide();
        $('#menu-logout').hide();
    } else if (!window.help) {
        $('#menu-report').hide();
    }
    $('#menu-show_all').click();
}
function toggle_sidebar() {
    $('#sidebar-overlay').toggle();
    $('#sidebar-wrapper').toggleClass('toggled');
    $('#sidebar-btn-content').toggleClass('glyphicon-menu-hamburger');
    $('#sidebar-btn-content').toggleClass('glyphicon-remove');
}