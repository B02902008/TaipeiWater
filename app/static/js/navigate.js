$(document).ready(function () {
    $('input:radio[name=navigate-way]').click(function () {
        $('input:text[name=index]').prop('disabled', !($('input:radio:checked[name=navigate-way]').val() === '1'));
    });
    $('#navigate-cancel-btn').click(function () {
        window.state = 'clear';
        page_control();
    });
    $('#navigate-apply-btn').click(function () {
        let way = $('input:radio:checked[name=navigate-way]').val();
        if (way === '0') {

        } else {
            let index = $('input:text[name=index]').val();

        }
    });
});