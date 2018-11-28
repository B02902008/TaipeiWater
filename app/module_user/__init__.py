from flask import Blueprint

blue_user = Blueprint('user', __name__)

from . import view
