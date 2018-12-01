$(document).ready(function () {
    let view_type_arr = window.view_type.split("").map(function(x){return(x==="1");});
    let view_status_arr = window.view_status.split("").map(function(x){return(x==="1");});
    let view_range_val = window.view_range;
    let tmp = true;
    view_type_arr.forEach(function (val, idx) {
        $('input[type=checkbox][name=place][value='+ idx +']').prop("checked", val);
        tmp = tmp & val;
    });
    $("input[type=checkbox][name=place-all]").prop("checked", tmp);
    $("input[type=checkbox][name=place-all]").click(function() {
        $("input[name=place]").prop("checked", $("input[type=checkbox][name=place-all]").prop("checked"));
    });
});