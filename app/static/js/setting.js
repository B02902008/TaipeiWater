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
        view_type_arr.forEach(function (val, idx) {
            view_type_arr[idx] = $('input:checkbox[name=place][value=' + idx + ']').prop("checked");
        });
        view_status_arr.forEach(function (val, idx) {
            view_status_arr[idx] = $('input:checkbox[name=status][value=' + idx + ']').prop("checked");
        });
        if (!window.help) {
            view_status_arr[1] = false;
            view_status_arr[2] = false;
        }
        if (!$('input:checkbox[name=range]').prop("checked"))
            view_range_val = 0;
        else {
            tmp = $('input:text[name=range]').val().match(/\d+.?\d*/i);
            view_range_val = (tmp == null) ? 0 : (parseFloat(tmp[0]) / 1000.0);
        }
        console.log(view_type_arr, view_status_arr, view_range_val);
    });
});