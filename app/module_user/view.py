from flask import request
from . import blue_user
from app.module_database import db_operation as db_op
import uuid
import json


@blue_user.route('/login', methods=['POST'])
def login():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return {"success": -1, "msg": "資料庫錯誤"}
    sql = "SELECT id, help FROM users WHERE username='" + \
          request.values['username'] + "' AND password=Password('" + request.values['password'] + "')"
    result = db_op.sql_execute(cursor, sql)
    if len(result) != 1:
        db_op.db_close(db)
        return {"success": -1, "msg": "帳號或密碼錯誤"}
    uid = result[0][0]
    help = (result[0][1] == 1)
    token = str(uuid.uuid1())
    sql = "UPDATE users SET token='" + token + "', tokenExpire=DATE_ADD(NOW(), INTERVAL 3 DAY) WHERE id=" + uid
    db_op.sql_execute(cursor, sql)
    db_op.db_close(db)
    return {"success": 1, "msg": json.dumps({"uid": uid, "help": help, "token": token})}


@blue_user.route('/token', methods=['POST'])
def token():
    print(request.values)
    return 'Hi'


@blue_user.route('/register', methods=['POST'])
def register():
    print(request.values)
    return 'Hi'


@blue_user.route('/logout', methods=['POST'])
def logout():
    print(request.values)
    return 'Hi'
