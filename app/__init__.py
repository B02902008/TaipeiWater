from flask import Flask
from flask import render_template
from app.module_load import blue_load
from app.module_user import blue_user
from app.module_util import blue_util

app = Flask(__name__)
app.register_blueprint(blue_load, url_prefix='/load')
app.register_blueprint(blue_user, url_prefix='/user')
app.register_blueprint(blue_util, url_prefix='/util')


@app.route('/')
def index():
    return render_template('index.html')
