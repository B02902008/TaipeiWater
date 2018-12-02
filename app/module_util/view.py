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
    dict = {"D": [], "U": []}
    sql = "SELECT * FROM fountain_default"
    result = db_op.sql_execute(db, cursor, sql, False)
    for re in result:
        if re[4] in aoh:
            dict["D"].append({"config": {"position": {"lat": re[5], "lng": re[6]},
                                         "title": "D" + str(re[0]).zfill(4)},
                              "info": {"id": "D" + str(re[0]).zfill(4),
                                       "place": re[1],
                                       "type": re[2],
                                       "location": re[3],
                                       "open": open_hour_2string(oh[re[4]]),
                                       "number": re[7],
                                       "status": re[8]}})
    return dict


def open_hour_2string(oh):
    str = ''
    for pair in oh:
        str += pair[0][:2] + '：' + pair[0][2:] + ' ~ ' + pair[1][:2] + '：' + pair[1][2:] + ' , '
    return str[:-3]


@blue_util.route('/data', methods=['GET'])
def data():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    weekday = (datetime.datetime.today().weekday() + 1) % 7
    time = str(datetime.datetime.today().hour) + str(datetime.datetime.today().minute)
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
