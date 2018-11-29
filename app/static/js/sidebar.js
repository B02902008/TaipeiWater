$(document).ready(function () {
    if (!window.login) {
        $('#menu-report').hide();
        $('#menu-logout').hide();
    } else if (!window.help) {
        $('#menu-report').hide();
    }
    $('#sidebar-btn').click(function () {
        toggle_sidebar();
        $('#sidebar-btn').blur();
    });
    $('#sidebar-overlay').click(function () {
        toggle_sidebar();
    });
    $('#menu-show_all').addClass("menu-selected");
    $('.menu-list-item').click(function (event) {
        $('.menu-list-item').removeClass("menu-selected");
        $(event.target.parentElement).addClass("menu-selected");
        toggle_sidebar();
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
                    window.uid = -1;
                    window.help = false;
                    window.token = '';
                    window.login = false;
                    window.state = "login";
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
function toggle_sidebar() {
    $('#sidebar-overlay').toggle();
    $('#sidebar-wrapper').toggleClass('toggled');
    $('#sidebar-btn-content').toggleClass('glyphicon-menu-hamburger');
    $('#sidebar-btn-content').toggleClass('glyphicon-remove');
}