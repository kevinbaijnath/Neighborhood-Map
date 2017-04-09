from app.classes.yelp import Yelp
import responses

class TestYelp:

    @responses.activate
    def setup_method(self, test_method):
        self.config = {
            'OAUTH': {
                'GRANT_TYPE': 'client_credentials',
                'URL': 'http://mock_oauth_url',
                'CLIENT': {
                    'ID': 'TEST_ID',
                    'SECRET': 'TEST_SECRET'
                }
            },
            'SEARCH': {
                'TERM': 'restaurants',
                'RADIUS': 1,
                'LIMIT': 1,
                'URL': 'http://mock_search_url/'
            },
            'BUSINESS': {
                'URL': 'http://mock_business_url/'
            }
        }

        responses.add(responses.POST, self.config['OAUTH']['URL'],
                 json={"access_token": "test", "expires_in": "155530622", "token_type": "Bearer"}, status=200,
                 content_type='application/json')
        self.yelp = Yelp(self.config)
        self.expected_auth_header = "Bearer test"

    def test_initialization(self):
        assert self.yelp.search_url == self.config['SEARCH']['URL']
        assert self.yelp.business_url == self.config['BUSINESS']['URL']
        assert self.yelp._request_session.headers['Authorization'] == self.expected_auth_header

    def test_search_config(self):
        assert self.config.get('SEARCH') is not None
        search_config = self.config['SEARCH']

        d = {
            'term': search_config['TERM'],
            'radius': search_config['RADIUS'],
            'limit': search_config['LIMIT']
        }
        assert Yelp._search_config(self.config['SEARCH']) == d

    @responses.activate
    def test_get_access_token(self):
        assert self.config.get('OAUTH') is not None
        oauth_url = self.config['OAUTH']['URL']
        with responses.RequestsMock(assert_all_requests_are_fired=True) as rsps:
            rsps.add(responses.POST, oauth_url, status=401)
            rsps.add(responses.POST, oauth_url, status=500)
            rsps.add(responses.POST, oauth_url, json={"access_token": "test", "expires_in": "155530622", "token_type": "Bearer"}, status=200, content_type='application/json')

            access_token = Yelp._get_access_token(self.config['OAUTH'])
            assert access_token is None

            access_token = Yelp._get_access_token(self.config['OAUTH'])
            assert access_token is None

            access_token = Yelp._get_access_token(self.config['OAUTH'])
            assert access_token == self.expected_auth_header

    @responses.activate
    def test_search(self):
        responses.add(responses.GET, self.yelp.search_url, status=200)

        resp = self.yelp.search(90,90)
        url = resp.request.url
        assert 'latitude' in url
        assert 'longitude' in url
        assert 'term' in url
        assert 'radius' in url
        assert 'limit' in url

    @responses.activate
    def test_business(self):
        id="test"
        responses.add(responses.GET, self.yelp.business_url+id, status=200)

        resp = self.yelp.business(id)
        assert resp.request.url == self.yelp.business_url+id