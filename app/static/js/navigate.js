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
            let data = find_data_by_distance();
            if (data == null) {
                alert("暫無符合條件的飲水機，請至偏好設定調整");
                window.state = 'clear';
                page_control();
            } else {
                update_position();
                draw_navigation(window.curPosition, data.config.position, data);
                window.state = 'clear';
                page_control();
            }
        } else {
            let index = $('input:text[name=index]').val();
            if (index === "") {
                alert("編號不可為空白");
            } else {
                let data = find_data_by_id(index);
                if (data == null) {
                    alert("指定的飲水機不存在或尚未開放");
                    window.state = 'clear';
                    page_control();
                } else {
                    update_position();
                    draw_navigation(window.curPosition, data.config.position, data);
                    window.state = 'clear';
                    page_control();
                }
            }
        }
    });
});