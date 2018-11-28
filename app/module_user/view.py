from flask import request
from . import blue_user


@blue_user.route('/login', methods=['POST'])
def login():
    print(request.values)
    return 'Hi'