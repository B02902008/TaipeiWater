from flask import request
from . import blue_util
from app.module_database import db_operation as db_op
import datetime
import json


def get_open_hour(wd, db, cursor):
    sql = "SELECT `type`,`from`,`to` FROM open_hour WHERE weekday=" + wd
    result = db_op.sql_execute(db, cursor, sql, False)
    dict = {}
    for re in result:
        if re[0] in dict:
            dict.get(re[0]).append((re[1], re[2]))
        else:
            dict[re[0]] = [(re[1], re[2])]
    return dict


def get_data(aoh, oh, db, cursor):
    dict = []
    sql = "SELECT * FROM fountain_default"
    result = db_op.sql_execute(db, cursor, sql, False)
    for re in result:
        if re[4] in aoh:
            dict.append({"config": {"position": {"lat": re[5], "lng": re[6]},
                                    "title": "D" + str(re[0]).zfill(4)},
                         "info": {"id": "D" + str(re[0]).zfill(4),
                                  "place": re[1],
                                  "type": re[2],
                                  "location": re[3],
                                  "open": open_hour_2string(oh[re[4]]),
                                  "number": re[7],
                                  "status": re[8]}})
    sql = "SELECT * FROM fountain_user"
    result = db_op.sql_execute(db, cursor, sql, False)
    for re in result:
        if re[4] in aoh:
            dict.append({"config": {"position": {"lat": re[5], "lng": re[6]},
                                    "title": "U" + str(re[0]).zfill(4)},
                         "info": {"id": "U" + str(re[0]).zfill(4),
                                  "place": re[1],
                                  "type": re[2],
                                  "location": re[3],
                                  "open": open_hour_2string(oh[re[4]]),
                                  "number": re[7],
                                  "status": re[8]}})
    return dict


def get_confirm_data(idx, db, cursor):
    if idx[0] == 'D':
        sql = 'SELECT status FROM fountain_default WHERE id =' + str(int(idx[1:]))
        result = db_op.sql_execute(db, cursor, sql, False)
        if len(result) != 1:
            return None, None
        return result[0][0], -1
    else:
        sql = 'SELECT status,uid FROM fountain_user WHERE id =' + str(int(idx[1:]))
        result = db_op.sql_execute(db, cursor, sql, False)
        if len(result) != 1:
            return None, None
        return result[0][0], result[0][1]


def confirm_data(idx, ava, db, cursor):
    table = 'fountain_default' if idx[0] == 'D' else 'fountain_user'
    sql = 'UPDATE ' + table + ' SET status=' + ava + ' WHERE id=' + str(int(idx[1:]))
    db_op.sql_execute(db, cursor, sql, True)
    return


def report_data(info, uid, db, cursor):
    open = find_open_type(info['open'], db, cursor)
    sql = "INSERT INTO `fountain_user` " + \
          "(`place`,`type`,`location`,`open`,`latitude`,`longitude`,`number`,`status`,`uid`) VALUES ('" + \
          info['place'] + "'," + info['type'] + ",'" + info['location'] + "'," + open + "," + \
          str(info['position']['lat']) + "," + str(info['position']['lng']) + "," + str(info['number']) + \
          ",0," + uid + ")"
    db_op.sql_execute(db, cursor, sql, True)
    return


def find_open_type(open, db, cursor):
    set_lst = []
    for key in open.keys():
        sql = "SELECT `type` FROM open_hour WHERE weekday=" + key + " AND `from`='" + open[key][0] + "' AND `to`='" + \
              open[key][1] + "'"
        result = db_op.sql_execute(db, cursor, sql, False)
        tmp = []
        for re in result:
            tmp.append(re[0])
        set_lst.append(set(tmp))
    print(set_lst)
    op = set.intersection(*set_lst)
    print(op)
    if len(op) == 0:
        sql = 'SELECT MAX(`type`) FROM open_hour'
        result = db_op.sql_execute(db, cursor, sql, False)
        type = result[0][0] + 1
        for key in open.keys():
            sql = "INSERT INTO `open_hour` (`type`,`weekday`,`from`,`to`) VALUES (" + str(type) + "," + key + ",'" + \
                  open[key][0] + "','" + open[key][1] + "')"
            db_op.sql_execute(db, cursor, sql, True)
        return str(type)
    else:
        return str(list(op)[0])


def open_hour_2string(oh):
    str = ''
    for pair in oh:
        str += pair[0][:2] + '：' + pair[0][2:] + ' ~ ' + pair[1][:2] + '：' + pair[1][2:] + ' , '
    return str[:-3]


def auth_user(id, tkn, db, cursor):
    sql = "SELECT COUNT(*) FROM users WHERE id=" + id + " AND token='" + tkn + "'"
    result = db_op.sql_execute(db, cursor, sql, False)
    if result[0][0] != 1:
        return False
    return True


@blue_util.route('/data', methods=['GET'])
def data():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    weekday = (datetime.datetime.today().weekday() + 1) % 7
    time = str(datetime.datetime.today().hour).zfill(2) + str(datetime.datetime.today().minute).zfill(2)
    open_hour = get_open_hour(str(weekday), db, cursor)
    available_open_hour = []
    for key in open_hour.keys():
        tmp = False
        for pair in open_hour[key]:
            if pair[0] <= time <= pair[1]:
                tmp = True
        if tmp:
            available_open_hour.append(key)
    result = get_data(available_open_hour, open_hour, db, cursor)
    return json.dumps({"success": True, "msg": result})


@blue_util.route('/confirm', methods=['POST'])
def confirm():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    if not auth_user(str(request.values['uid']), request.values['token'], db, cursor):
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "無法確認使用者身份"})
    status, uid = get_confirm_data(request.values['index'], db, cursor)
    if status is None or uid is None:
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "無指定飲水機資料"})
    elif uid == request.values['uid']:
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "無法球員兼裁判"})
    elif status != 0:
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "指定飲水機非待確認"})
    elif not (request.values['available'] == 1 or request.values['available'] == -1):
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "需指定為可使用/不可使用"})
    else:
        confirm_data(request.values['index'], str(request.values['available']), db, cursor)
    db_op.db_close(db)
    return json.dumps({"success": True, "msg": "飲水機狀態已更新，感謝您幫助完善臺北找水喝"})


@blue_util.route('/report', methods=['POST'])
def report():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    if not auth_user(str(request.values['uid']), request.values['token'], db, cursor):
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "無法確認使用者身份"})
    report_data(json.loads(request.values['data']), str(request.values['uid']), db, cursor)
    db_op.db_close(db)
    return json.dumps({"success": True, "msg": "飲水機資料已加入，感謝您幫助完善臺北找水喝"})
