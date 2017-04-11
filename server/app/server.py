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

    response = yelp.search(latitude, longitude)

    if response.status_code != requests.codes.ok:
        abort(response.status_code)

    json_value = response.json()
    output = { "businesses": [] }

    # Strip out all of the data except the restaurant name and id
    for restaurant in json_value["businesses"]:
        output["businesses"].append({"name": restaurant["name"],"id":restaurant["id"],"location": restaurant["coordinates"]})

    result = jsonify(output)
    result.headers.add('Access-Control-Allow-Origin', '*')
    return result

@app.route('/api/yelp/business/<id>')
def yelp_business(id):
    if not id:
        abort(404)

    response = yelp.business(id)

    if response.status_code != requests.codes.ok:
        abort(response.status_code)

    json_value = response.json()
    categories = [x["title"] for x in json_value["categories"]]
    output = {
        json_value["id"]: {
            "photos": json_value["photos"],
            "rating": json_value["rating"],
            "review_count": json_value["review_count"],
            "url": json_value["url"],
            "address": json_value["location"]["display_address"],
            "is_open_now": json_value["hours"][0]["is_open_now"],
            "categories": categories
        }
    }

    result = jsonify(output)
    result.headers.add('Access-Control-Allow-Origin', '*')
    return result

if __name__ == '__main__':
    app.secret_key = 'test'
    app.debug = True
    app.run(host='0.0.0.0', port=6060)
