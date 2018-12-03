from flask import render_template
from . import blue_load


@blue_load.route('/sidebar', methods=['GET'])
def load_sidebar():
    return render_template('sidebar.html')


@blue_load.route('/panel', methods=['GET'])
def load_panel():
    return render_template('panel.html')


@blue_load.route('/login', methods=['GET'])
def load_login():
    return render_template('login.html')


@blue_load.route('/register', methods=['GET'])
def load_register():
    return render_template('register.html')


@blue_load.route('/setting', methods=['GET'])
def load_setting():
    return render_template('setting.html')


@blue_load.route('/target', methods=['GET'])
def load_target():
    return render_template('target.html')


@blue_load.route('/navigate', methods=['GET'])
def load_navigate():
    return render_template('navigate.html')


@blue_load.route('/report', methods=['GET'])
def load_report():
    return render_template('report.html')

