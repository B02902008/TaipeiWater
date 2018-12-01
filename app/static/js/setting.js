$(document).ready(function () {
    let view_type_arr = window.view_type.split("").map(function(x){return(x==="1");});
    let view_status_arr = window.view_status.split("").map(function(x){return(x==="1");});
    let view_range_val = window.view_range;
    let tmp;
    tmp = true;
    view_type_arr.forEach(function (val, idx) {
        $('input:checkbox[name=place][value=' + idx + ']').prop("checked", val);
        tmp = tmp & val;
    });
    $('input:checkbox[name=place-all]').prop("checked", tmp);
    $('input:checkbox[name=place-all]').click(function() {
        $('input:checkbox[name=place]').prop("checked", $('input:checkbox[name=place-all]').prop("checked"));
    });
    $('input:checkbox[name=place]').click(function () {
        $('input:checkbox[name=place-all]').prop("checked",
            $("input:checkbox:checked[name=place]").length === view_type_arr.length);
    });
    if (!window.help) {
        $('input:checkbox[name=status][value=1]').prop("disabled", true);
        $('input:checkbox[name=status][value=2]').prop("disabled", true);
    }
    tmp = true;
    view_status_arr.forEach(function (val, idx) {
        $('input:checkbox[name=status][value='+ idx +']').prop("checked", val);
        tmp = tmp & val;
    });
    $('input:checkbox[name=status-all]').prop("checked", tmp);

    $('input:checkbox[name=status-all]').click(function() {
        $('input:checkbox[name=status]').prop("checked", $('input:checkbox[name=status-all]').prop("checked"));
    });
    $('input:checkbox[name=status]').click(function () {
        $('input:checkbox[name=status-all]').prop("checked",
            $("input:checkbox:checked[name=status]").length === view_status_arr.length);
    });
    if (view_range_val == 0) {
        $('input:text[name=range]').prop('disabled', true);
    } else {
        $('input:checkbox[name=range]').prop('checked', true);
        $('input:text[name=range]').val(view_range_val * 1000);
    }
    $('input:checkbox[name=range]').click(function () {
        $('input:text[name=range]').prop('disabled', !$('input:checkbox[name=range]').prop("checked"));
    });
    $('#setting-cancel-btn').click(function () {
        window.state = 'clear';
        page_control();
    });
    $('#setting-apply-btn').click(function () {
        tmp = '';
        view_type_arr.forEach(function (val, idx) {
            tmp += $('input:checkbox[name=place][value=' + idx + ']').prop("checked") ? '1' : '0';
        });
        window.view_type = tmp;
        tmp = '';
        view_status_arr.forEach(function (val, idx) {
            tmp += (!window.help && idx > 0) ? '0' :
                ($('input:checkbox[name=status][value=' + idx + ']').prop("checked") ? '1' : '0');
        });
        window.view_status = tmp;
        if (!$('input:checkbox[name=range]').prop("checked"))
            window.view_range = 0;
        else {
            tmp = $('input:text[name=range]').val().match(/\d+.?\d*/i);
            window.view_range = (tmp == null) ? 0 : (parseFloat(tmp[0]) / 1000.0);
        }
        $.ajax({
			url: "/user/setting",
            type: "POST",
			dataType: "JSON",
            async: false,
			data: {
			    uid: window.uid,
                token: window.token,
				view_type: window.view_type,
				view_status: window.view_status,
                view_range: window.view_range
			},
			success: function(response) {
				if (response.success) {
				    alert(response.msg);
                    window.state = 'clear';
                    page_control();
                    click_showall();
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