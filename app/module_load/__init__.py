from flask import Blueprint

blue_load = Blueprint('load', __name__)

from . import view