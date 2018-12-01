$(document).ready(function () {
    let view_type_arr = window.view_type.split("").map(function(x){return(x==="1");});
    let view_status_arr = window.view_status.split("").map(function(x){return(x==="1");});
    let view_range_val = window.view_range;
    view_type_arr.forEach(function (val, idx) {
        $('input[type=checkbox][name=place][value='+ idx +']').prop("checked", val);
    })
});