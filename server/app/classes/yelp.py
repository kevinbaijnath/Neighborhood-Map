import requests

class Yelp:
    def __init__(self,yelp_config):
        self.search_url = yelp_config['SEARCH']['URL']
        self.business_url = yelp_config['BUSINESS']['URL']
        self.search_config = self._search_config(yelp_config['SEARCH'])
        self._request_session = requests.Session()
        self._request_session.headers.update({'Authorization': self._get_access_token(yelp_config['OAUTH'])})
    @staticmethod
    def _search_config(search_config):
        YELP_SEARCH = search_config
        return {
            'term': YELP_SEARCH['TERM'],
            'radius': YELP_SEARCH['RADIUS'],
            'limit': YELP_SEARCH['LIMIT']
        }

    @staticmethod
    def _get_access_token(oauth_config):
        YELP_OAUTH = oauth_config
        response = requests.post(YELP_OAUTH['URL'], data={
            'grant_type': YELP_OAUTH['GRANT_TYPE'],
            'client_id': YELP_OAUTH['CLIENT']['ID'],
            'client_secret': YELP_OAUTH['CLIENT']['SECRET']
        })
        if response.status_code != requests.codes.ok:
            return None

        response_json = response.json()

        return response_json['token_type'] + ' ' + response_json['access_token']

    def search(self, latitude, longitude):
        payload = {**self.search_config, 'latitude': latitude, 'longitude': longitude}
        return self._request_session.get(self.search_url, params=payload)

    def business(self, id):
        return self._request_session.get(self.business_url+id)