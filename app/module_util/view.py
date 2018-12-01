from flask import request
from . import blue_util
from app.module_database import db_operation as db_op
import datetime
import json


def get_open_hour(wd, db, cursor):
    sql = "SELECT * FROM open_hour WHERE weekday=" + wd
    result = db_op.sql_execute(db, cursor, sql, False)
    dict = {}
    for re in result:
        if re[1] in dict:
            dict.get(re[1]).append((re[2], re[3]))
        else:
            dict[re[1]] = [(re[2], re[3])]
    return dict


@blue_util.route('/data', methods=['GET'])
def data():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    weekday = (datetime.datetime.today().weekday() + 1) % 7
    open_hour = get_open_hour(str(weekday), db, cursor)
    print(open_hour)
    return
