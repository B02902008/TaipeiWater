'use strict';
$(document).ready(function () {
    window_reset();
	$('#panel-container').load("/load/panel", function () {
        $('#sidebar-container').load("/load/sidebar", function () {
            login_token();
        });
    });
});
function window_reset() {
    window.uid = -1;
    window.help = false;
    window.token = '';
    window.view_type = '111111111';
    window.view_status = '100';
    window.view_range = 0;
    window.login = false;
    window.state = "login";
    window.data_raw = [];
    window.data_filtered = [];
    window.data_view = [];
}
function hide_panel() {
    $('#panel-container').hide();
}
function show_panel() {
    $('#panel-container').show();
}
function hide_sidebar() {
    $('#sidebar-container').hide();
}
function show_sidebar() {
    $('#sidebar-container').show();
}
function setCookie(name, value, expire) {
    let d = new Date();
    d.setTime(d.getTime() + (expire * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + value + "; expires=" + d.toUTCString();
}
function getCookie(name) {
    let key = name + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0 ; i < cookies.length ; i ++) {
        let c = cookies[i].trim();
        if (c.indexOf(key) == 0)
        	return c.substring(key.length, c.length);
    }
    return null;
}
function login_token() {
    window.token = getCookie('token');
	if ( window.token != null) {
        $.ajax({
            url: "/user/token",
            type: "POST",
            dataType: "JSON",
            async: false,
            data: {
                token: window.token,
            },
            success: function(response) {
                if (response.success) {
                    let obj = response.msg;
                    setCookie('token', obj.token, 7);
                    window.uid = obj.uid;
                    window.help = obj.help;
                    window.token = obj.token;
                    window.view_type = obj.view_type;
                    window.view_status = obj.view_status;
                    window.view_range = obj.view_range;
                    window.login = true;
                    window.state = "init";
                    page_control();
                } else {
                    alert(response.msg);
                    page_control();
                }
            },
            error: function(response) {
                console.log(response);
            }
        });
	} else {
        page_control();
	}
}
function data_request_show() {
    $.ajax({
        url: "/util/data",
        type: "GET",
        dataType: "JSON",
        async: false,
        data: {},
        success: function(response) {
            if (response.success) {
                window.data_raw = response.msg;
                data_filter();
                markers_clear();
                window.data_view = window.data_filtered;
                data_show();
            } else {
                alert(response.msg);
            }
        },
        error: function(response) {
            console.log(response);
        }
    });
}
function data_filter() {
    let view_type_arr = window.view_type.split("").map(function(x){return(x==="1");});
    let view_status_arr = window.view_status.split("").map(function(x){return(x==="1");});
    let view_type_map = {0: '開放空間', 1: '學校', 2: '運動中心', 3 : '醫院', 4: '政府機關',
        5: '捷運站', 6: '公共設施', 7: '圖書館', 8: '其他'};
    let view_status_map = {0: '可使用', 1: '待確認', 2: '暫停使用'};
    console.log(view_type_arr, view_status_arr, data_raw);
    window.data_filtered = window.data_raw.filter(function (x) {
        let tmp1 = view_type_arr[x.info.type];
        let tmp2 = view_status_arr[1 - x.info.status];
        let tmp3 = (window.view_range == 0) ? true : (distance(x.config.position, window.curPosition) <= window.view_range);
        if (tmp1 && tmp2 && tmp3) {
            x.info.type = view_type_map[x.info.type];
            x.info.status = view_status_map[1 - x.info.status];
            if (x.info.number == 0)
                x.info.number = '若干';
            return x;
        }
    });
}
function markers_clear() {
    window.markers.forEach(function (val, idx) {
        window.markers[idx].setMap(null);
    });
    window.markers = [];
}
function data_show() {
    if (window.view_range != 0)
        update_position();
    window.data_view.forEach(function (val, idx) {
        window.markers[idx] = new google.maps.Marker(val.config);
        window.markers[idx].setMap(window.map);
        window.markers[idx].addListener('click', function() {
            let infowindow = new google.maps.InfoWindow({
                content: info2string(val.info)
            });
            infowindow.open(map, window.markers[idx]);
        });
    });
}
function info2string(info) {
    let str = '';
    str += '飲水機編號：' + info.id + '<br>';
    str += '設置場所：' + info.place + '  (' + info.type + ')<br>';
    str += '本日開放時段：' + info.open + '<br>';
    str += '設置台數：' + info.number + '  (' + info.status + ')<br>';
    str += '設置位置：' + info.location;
    return str;
}
function distance(p1, p2) {
    let radLat1 = p1.lat * Math.PI / 180.0;
    let radLat2 = p2.lat * Math.PI / 180.0;
    let a = radLat1 - radLat2;
    let b = p1.lng * Math.PI / 180.0 - p2.lng * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    return s;
}
function page_control() {
	switch (window.state) {
		case "login":
            load_login();
		    show_panel();
		    hide_sidebar();
            break;
		case "register":
            load_register();
		    show_panel();
		    hide_sidebar();
            break;
		case "init":
		    data_request_show();
		    initial_sidebar();
		    hide_panel();
		    clear_panel();
		    show_sidebar();
		    click_showall();
            break;
		case "setting":
            load_setting();
		    show_panel();
		    show_sidebar();
            break;
		case "showall":
		    clear_panel();
		    hide_panel();
		    show_sidebar();
		    data_request_show();
		    click_showall();
            break;
        case "clear":
		    clear_panel();
		    hide_panel();
		    show_sidebar();
            break;
		default:
			break;
    }
}