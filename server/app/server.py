from flask import Flask, request, abort, jsonify
import requests
from config.secrets import YELP_CLIENT_ID, YELP_CLIENT_SECRET
from classes.yelp import Yelp

app = Flask(__name__)
app.config.from_pyfile('config\config.py')

# by doing it this way we can enable loading this information from system variables
app.config['YELP']['OAUTH']['CLIENT'] = { 'ID': YELP_CLIENT_ID, 'SECRET': YELP_CLIENT_SECRET }

yelp = Yelp(app.config['YELP'])
yelp.search("47.6062","-122.3321")

@app.route('/api/yelp/search')
def yelp_search():
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')

    if not latitude or not longitude:
        abort(404)

    return process_response(yelp.search(latitude, longitude))

@app.route('/api/yelp/business/<id>')
def yelp_business(id):
    if not id:
        abort(404)

    return process_response(yelp.business(id))

def process_response(response):
    if response.status_code != requests.codes.ok:
        abort(response.status_code)

    return jsonify(response.json())

if __name__ == '__main__':
    app.secret_key = 'test'
    app.debug = True
    app.run(host='0.0.0.0', port=6060)
