from flask import request
from . import blue_user
from app.module_database import db_operation as db_op
import uuid
import json


def select_user_with_account(usr, pwd, db, cursor):
    sql = "SELECT id, help FROM users WHERE username='" + usr + "' AND password=Password('" + pwd + "')"
    result = db_op.sql_execute(db, cursor, sql, False)
    if len(result) != 1:
        return None, None
    return result[0][0], (result[0][1] == 1)


def select_user_with_token(tkn, db, cursor):
    sql = "SELECT id, help FROM users WHERE token='" + tkn + "' AND tokenExpire>=NOW()"
    result = db_op.sql_execute(db, cursor, sql, False)
    if len(result) != 1:
        return None, None
    return result[0][0], (result[0][1] == 1)


def select_user_setting(id, db, cursor):
    sql = "SELECT * FROM user_setting WHERE id=" + id
    result = db_op.sql_execute(db, cursor, sql, False)
    if len(result) != 1:
        return None, None, None
    return result[0][1], result[0][2], result[0][3]


def update_setting(id, vt, vs, vr, db, cursor):
    sql = "UPDATE user_setting SET view_type='" + vt + "', view_status='" + vs + "', view_range=" + \
          vr + " WHERE id=" + id
    db_op.sql_execute(db, cursor, sql, True)
    return


def update_token(id, tkn, db, cursor):
    sql = "UPDATE users SET token='" + tkn + "', tokenExpire=DATE_ADD(NOW(), INTERVAL 7 DAY) WHERE id=" + id
    db_op.sql_execute(db, cursor, sql, True)
    return


def clear_token(id, db, cursor):
    sql = "UPDATE users SET token='', tokenExpire=TIMESTAMP(0) WHERE id=" + id
    db_op.sql_execute(db, cursor, sql, True)
    return


def check_account(usr, db, cursor):
    sql = "SELECT COUNT(*) FROM users WHERE username='" + usr + "'"
    result = db_op.sql_execute(db, cursor, sql, False)
    if result[0][0] != 0:
        return False
    return True


def insert_user(usr, pwd, helper, db, cursor):
    sql = "INSERT INTO users (username,password,help) VALUES ('" + usr + "',PASSWORD('" + \
          pwd + "')," + (str(1) if helper else str(0)) + ")"
    db_op.sql_execute(db, cursor, sql, True)
    sql = "INSERT INTO user_setting () VALUES ()"
    db_op.sql_execute(db, cursor, sql, True)
    return


def auth_user(id, tkn, db, cursor):
    sql = "SELECT COUNT(*) FROM users WHERE id=" + id + " AND token='" + tkn + "'"
    result = db_op.sql_execute(db, cursor, sql, False)
    if result[0][0] != 1:
        return False
    return True


@blue_user.route('/login', methods=['POST'])
def login():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    uid, help = select_user_with_account(request.values['username'], request.values['password'], db, cursor)
    if uid is None or help is None:
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "帳號或密碼錯誤"})
    view_type, view_status, view_range = select_user_setting(str(uid), db, cursor)
    if view_type is None or view_status is None or view_range is None:
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "無法載入使用者偏好設定"})
    token = str(uuid.uuid1())
    update_token(str(uid), token, db, cursor)
    db_op.db_close(db)
    return json.dumps({"success": True, "msg": {"uid": uid, "help": help, "token": token, "view_type": view_type,
                                                "view_status": view_status, "view_range": view_range}})


@blue_user.route('/token', methods=['POST'])
def token():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    uid, help = select_user_with_token(request.values['token'], db, cursor)
    if uid is None or help is None:
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "登入逾期，請重新登入"})
    view_type, view_status, view_range = select_user_setting(str(uid), db, cursor)
    if view_type is None or view_status is None or view_range is None:
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "無法載入使用者偏好設定"})
    token = str(uuid.uuid1())
    update_token(str(uid), token, db, cursor)
    db_op.db_close(db)
    return json.dumps({"success": True, "msg": {"uid": uid, "help": help, "token": token, "view_type": view_type,
                                                "view_status": view_status, "view_range": view_range}})


@blue_user.route('/register', methods=['POST'])
def register():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    if not check_account(request.values['username'], db, cursor):
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "使用者已存在"})
    insert_user(request.values['username'], request.values['password'], request.values['helper'], db, cursor)
    db_op.db_close(db)
    return json.dumps({"success": True, "msg": "註冊成功，請進行登入"})


@blue_user.route('/logout', methods=['POST'])
def logout():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    if auth_user(str(request.values['uid']), request.values['token'], db, cursor):
        clear_token(str(request.values['uid']), db, cursor)
    db_op.db_close(db)
    return json.dumps({"success": True, "msg": ""})


@blue_user.route('/setting', methods=['POST'])
def setting():
    db, cursor = db_op.db_connect()
    if db is None or cursor is None:
        return json.dumps({"success": False, "msg": "資料庫錯誤"})
    if not auth_user(str(request.values['uid']), request.values['token'], db, cursor):
        db_op.db_close(db)
        return json.dumps({"success": False, "msg": "無法更新使用者偏好設定"})
    update_setting(str(request.values['uid']), request.values['view_type'], request.values['view_status'],
                   str(request.values['view_range']), db, cursor)
    db_op.db_close(db)
    return json.dumps({"success": True, "msg": "使用者偏好設定已更新"})
