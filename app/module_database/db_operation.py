import pymysql


def db_connect():
    try:
        db = pymysql.connect("localhost", "TaipeiWaterServer", "tpewater123", "TaipeiWater")
        cursor = db.cursor()
    except pymysql.err.OperationalError:
        return null, null
    return db, cursor


def sql_execute(cursor, sql):
    cursor.execute(sql)
    print(cursor.fetchAll())
    return
