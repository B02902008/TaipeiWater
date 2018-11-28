def db_connect():
    try:
        db = pymysql.connect("localhost", "TaipeiWaterServer", "tpewater123", "TaipeiWater")
        cursor = db.cursor()
    except pymysql.err.OperationalError:
        return null, null
    return db, cursor


def sql_excute(cursor, sql):
    cursor.excute(sql)
    print(cursor.fetchAll())
    return
