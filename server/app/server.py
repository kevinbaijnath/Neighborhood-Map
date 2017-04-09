from flask import Flask
import requests

app = Flask(__name__)
app.config.from_pyfile('config\config.py')


if __name__ == '__main__':
    app.secret_key = 'test'
    app.debug = True
    app.run(host='0.0.0.0', port=6060)
