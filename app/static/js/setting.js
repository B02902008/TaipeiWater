$(document).ready(function () {
    let view_type_arr = window.view_type.split("").map(function(x){return(x==="1");});
    let view_status_arr = window.view_status.split("").map(function(x){return(x==="1");});
    let view_range_val = window.view_range;
    let tmp = true;
    view_type_arr.forEach(function (val, idx) {
        $('input:checkbox[name=place][value='+ idx +']').prop("checked", val);
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
});