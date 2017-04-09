import requests

class Yelp:
    def __init__(self,yelp_config):
        self.yelp_config = yelp_config
        self._access_token = self._get_access_token()
        self.search_config = self._search_config()

    def _search_config(self):
        YELP_SEARCH = self.yelp_config['SEARCH']
        return {
            'term': YELP_SEARCH['TERM'],
            'radius': YELP_SEARCH['RADIUS'],
            'limit': YELP_SEARCH['LIMIT']
        }

    def _get_access_token(self):
        YELP_OAUTH = self.yelp_config['OAUTH']
        response = requests.post(YELP_OAUTH['URL'], data={
            'grant_type': YELP_OAUTH['GRANT_TYPE'],
            'client_id': YELP_OAUTH['CLIENT']['ID'],
            'client_secret': YELP_OAUTH['CLIENT']['SECRET']
        })
        print(response.status_code)
        if response.status_code != requests.codes.ok:
            return None

        response_json = response.json()

        return response_json['token_type'] + ' ' + response_json['access_token']

    def _request(self, url, payload=None):
        response = requests.get(url, headers={'Authorization': self._access_token}, params=payload)
        return response

    def search(self, latitude, longitude):
        payload = {**self.search_config, 'latitude': latitude, 'longitude': longitude}
        return self._request(self.yelp_config['SEARCH']['URL'], payload)

    def business(self, id):
        return self._request(self.yelp_config['BUSINESS']['URL']+id)