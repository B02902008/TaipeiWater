import pymysql


def db_connect():
    try:
        db = pymysql.connect("localhost", "TaipeiWaterServer", "tpewater123", "TaipeiWater")
        cursor = db.cursor()
    except pymysql.MySQLError:
        return null, null
    return db, cursor


def sql_execute(cursor, sql):
    try:
        cursor.execute(sql)
    except pymysql.MySQLError:
        return ()
    return cursor.fetchall()


def db_close(db):
    db.close()
    return
