$(document).ready(function () {
    $('#target-cancel-btn').click(function () {
        window.state = 'clear';
        page_control();
    });
    $('#target-apply-btn').click(function () {
        let address = $('input:text[name=target]').val();
        let tmp = $('input:text[name=range]').val().match(/\d+.?\d*/i);
        window.target_range = (tmp == null) ? 0.5 : (parseFloat(tmp[0]) / 1000.0);
        if (address === "") {
            alert("地點不可為空白");
        } else {
            locate_target(address, function (lat, lng, st) {
                if (lat == null || lng == null) {
                    window.state = 'clear';
                    page_control();
                    alert("找不到指定地點，原因：" + st);
                } else {
                    window.targetPosition.lat = lat;
                    window.targetPosition.lng = lng;
                    window.state = 'showtarget';
                    page_control();
                }
            });
        }
    });
});