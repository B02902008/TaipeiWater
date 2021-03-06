$(document).ready(function () {
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
    $('#menu-show_all').click(showall_click_func);
    $('#menu-navigate').click(function () {
        window.state = "navigate";
        page_control();
    });
    $('#menu-target').click(function () {
        window.state = "target";
        page_control();
    });
    $('#menu-report').click(function () {
        window.state = "report";
        page_control();
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
                    map_clear();
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
    $('.menu-list-item').show();
    if (!window.login) {
        $('#menu-report').hide();
        $('#menu-logout').hide();
    } else if (!window.help) {
        $('#menu-report').hide();
    }
}
function showall_click_func() {
    map_clear();
    data_show();
}
function click_showall() {
    $('.menu-list-item').removeClass("menu-selected");
    $('#menu-show_all').addClass("menu-selected");
}
function toggle_sidebar() {
    $('#sidebar-overlay').toggle();
    $('#sidebar-wrapper').toggleClass('toggled');
    $('#sidebar-btn-content').toggleClass('glyphicon-menu-hamburger');
    $('#sidebar-btn-content').toggleClass('glyphicon-remove');
}