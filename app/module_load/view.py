from . import blue_load


@blue_load.route('/sidebar')
def load_sidebar():
    return render_template('sidebar.html')


@blue_load.route('/panel')
def load_panel():
    return render_template('panel.html')


@blue_load.route('/login')
def load_login():
    return render_template('login.html')


@blue_load.route('/register')
def load_register():
    return render_template('register.html')