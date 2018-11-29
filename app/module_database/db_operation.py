import pymysql


def db_connect():
    try:
        db = pymysql.connect("localhost", "TaipeiWaterServer", "tpewater123", "TaipeiWater")
        cursor = db.cursor()
    except pymysql.MySQLError:
        return None, None
    return db, cursor


def sql_execute(db, cursor, sql, commit):
    try:
        cursor.execute(sql)
        if commit:
            db.commit()
    except pymysql.MySQLError:
        print("error")
        return ()
    return cursor.fetchall()


def db_close(db):
    db.close()
    return
