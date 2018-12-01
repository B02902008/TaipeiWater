from flask import Blueprint

blue_util = Blueprint('util', __name__)

from . import view
