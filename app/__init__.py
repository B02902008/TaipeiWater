from flask import Flask
from flask import render_template
from app.module_load import blue_load
from app.module_user import blue_user

app = Flask(__name__)
app.register_blueprint(blue_load, url_prefix='/load')
app.register_blueprint(blue_user, url_prefix='/user')


@app.route('/')
def index():
    return render_template('index.html')
