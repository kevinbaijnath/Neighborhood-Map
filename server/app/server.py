from flask import Flask
from .config.secrets import FLICKR_KEY, FLICKR_SECRET, YELP_CLIENT_ID, YELP_CLIENT_SECRET

app = Flask(__name__)
app.config.from_pyfile('config\config.py')
app.config['YELP']['OAUTH']['CLIENT'] = { 'YELP_CLIENT_ID': YELP_CLIENT_ID, 'YELP_CLIENT_SECRET': YELP_CLIENT_SECRET }
app.config['FLICKR'] = { 'FLICKR_KEY': FLICKR_KEY, 'FLICKR_SECRET': FLICKR_SECRET}
print(app.config)

#def get_yelp_access_token(YELP_OAUTH):


print(get_yelp_access_token(app.config['YELP']['OAUTH']))
if __name__ == '__main__':
    app.secret_key = 'test'
    app.debug = True
    app.run(host='0.0.0.0', port=6060)
