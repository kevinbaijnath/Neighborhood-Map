YELP = {
    'OAUTH': {
        'GRANT_TYPE': 'client_credentials',
        'URL': 'https://api.yelp.com/oauth2/token'
    },
    'SEARCH': {
        'TERM': 'restaurants',
        'RADIUS': 16000,
        'LIMIT': 25,
        'URL': 'https://api.yelp.com/v3/businesses/search'
    },
    'BUSINESS': {
        'URL': 'https://api.yelp.com/v3/businesses/'
    }
}