from app import app

if __name__ == '__main__':
    context = ('/etc/ssl/certificate.crt', '/etc/ssl/private.key')
    app.run(host='0.0.0.0', port=8443, ssl_context=context)
