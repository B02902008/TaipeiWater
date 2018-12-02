$(document).ready(function () {
    $('#target-cancel-btn').click(function () {
        window.state = 'clear';
        page_control();
    });
    $('#target-apply-btn').click(function () {
        let address = $('input:text[name=target]').val();
        let tmp = $('input:text[name=range]').val().match(/\d+.?\d*/i);
        window.target_range = (tmp == null) ? 0.5 : (parseFloat(tmp[0]) / 1000.0);
        console.log(address, window.target_range);
    });
});