from flask import Flask
from flask import render_template
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/load-sidebar')
def load_sidebar():
    return render_template('sidebar.html')

@app.route('/load-panel')
def load_panel():
    return render_template('panel.html')

@app.route('/load-login')
def load_login():
    return render_template('login.html')

@app.route('/load-register')
def load_register():
    return render_template('register.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8443, ssl_context='adhoc')