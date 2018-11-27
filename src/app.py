from flask import Flask, request
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

@app.route('/login', methods=['POST'])
def login():
    print(request.values)
    return 'Jizz'

if __name__ == '__main__':
    context = ('/etc/ssl/certificate.crt', '/etc/ssl/private.key')
    app.run(debug=True, host='0.0.0.0', port=8443, ssl_context=context)