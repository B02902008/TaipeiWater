from flask import request
from . import blue_user
from app.module_database import db_operation as db_op


@blue_user.route('/login', methods=['POST'])
def login():
    db, cursor = db_op.db_connect()
    sql = "SELECT id, help FROM users WHERE username='" + \
          request.values['username'] + "' AND password=Password('" + request.values['password'] + "')"
    db_op.sql_excute(cursor, sql)
    print(request.values)
    return 'Hi'


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
