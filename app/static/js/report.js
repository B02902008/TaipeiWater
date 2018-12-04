$(document).ready(function () {
    let data = find_data_nearby();
    data.forEach(function (val) {
        $('select[name=report-old-index]').append(new Option(val.info.id, val.info.id));
    });
    if (data.length == 0) {
        $('select[name=report-old-index] option:eq(0)').html('附近(100公尺內)沒有飲水機喔');
    }
    $('.report-way-form').hide();
    $('input:radio[name=report-way]').click(function() {
        let way = $('input:radio:checked[name=report-way]').val();
        $('.report-way-radio').hide();
        $('.report-way-form').hide();
        $('.report-way-form#' + way).show();
    });
    $('#report-cancel-btn').click(function () {
        window.state = 'clear';
        page_control();
    });
    $('#report-apply-btn').click(function () {
        let way = $('input:radio:checked[name=report-way]').val();
        if (way === "old") {
            let index = $('select[name=report-old-index]').val();
            let available = parseInt($('input:radio:checked[name=report-old-available]').val());
            if (index === null || available === undefined) {
                alert("有欄位為空白");
            } else {
                $.ajax({
                    url: "/util/confirm",
                    type: "POST",
                    dataType: "JSON",
                    async: false,
                    data: {
                        uid: window.uid,
                        token: window.token,
                        index: index,
                        available: available
                    },
                    success: function(response) {
                        if (response.success) {
                            alert(response.msg);
                            window.state = "init";
                            page_control();
                        } else {
                            alert(response.msg);
                        }
                    },
                    error: function(response) {
                        console.log(response);
                    }
                });
            }
        } else if (way === "new") {
            let type = $('select[name=report-new-type]').val();
            let place = $('input:text[name=report-new-place]').val();
            let location = $('input:text[name=report-new-location]').val();
            let number = parseInt($('input:text[name=report-new-number]').val());
            let open = {};
            $('input:checkbox[name=report-new-weekday]').each(function() {
                let weekday = parseInt($(this).val());
                if ($(this).prop('checked')) {
                    let time = $('input:text[name=report-new-open-' + weekday + ']').val();
                    let time_arr = time.replace(/\s/g, '').match(/(\d+)[\uFF1A:](\d+)[\uFF5E~](\d+)[\uFF1A:](\d+)/i);
                    if (time_arr != null) {
                        let fh = '00'.substring(time_arr[1].length) + time_arr[1];
                        let fm = '00'.substring(time_arr[2].length) + time_arr[2];
                        let th = '00'.substring(time_arr[3].length) + time_arr[3];
                        let tm = '00'.substring(time_arr[4].length) + time_arr[4];
                        open[weekday] = [fh + fm, th + tm];
                    } else {
                        open[weekday] = ['0000', '0000'];
                    }
                } else {
                    open[weekday] = ['0000', '0000'];
                }
            });
            if (type === null || place === '' || location === '' || isNaN(number)) {
                alert("有欄位為空白");
            } else {
                let obj = {};
                update_position();
                obj.place = place;
                obj.type = type;
                obj.location = location;
                obj.number = number;
                obj.position = window.curPosition;
                obj.open = open;
                $.ajax({
                    url: "/util/report",
                    type: "POST",
                    dataType: "JSON",
                    async: false,
                    data: {
                        uid: window.uid,
                        token: window.token,
                        data: JSON.stringify(obj)
                    },
                    success: function(response) {
                        if (response.success) {
                            alert(response.msg);
                            window.state = "init";
                            page_control();
                        } else {
                            alert(response.msg);
                        }
                    },
                    error: function(response) {
                        console.log(response);
                    }
                });
            }
        } else {
            alert("未選擇回報方式");
        }
    });
});