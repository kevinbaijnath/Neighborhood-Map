import oauthSignature from 'oauth-signature';

/** Class for interacting with Yelp API */
class Yelp {
  /**
   * Create a Yelp object
   * @constructor
   * @param {Object} config - Configuration object that contains Yelp API details
   * @param {string} consumer_key - Yelp API consumer key
   * @param {string} consumer_secret - Yelp API consumer secret
   * @param {string} token - Yelp API token
   * @param {string} token_secret - Yelp API token secret
   * @param {string} base_url - url for yelp api
  */
  constructor(config){
    this.consumer_key = config.consumer_key;
    this.consumer_secret = config.consumer_secret;
    this.token = config.token;
    this.token_secret = config.token_secret
    this.base_url = config.base_url;
  }

  /**
   * Generate a nonce for oauth interaction with Yelp API
   * @returns {string} - nonce
  */
  generateNonce() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

  /**
   * Generates query params for Yelp API search
   * @param {string} url - url for api
   * @param {string} term - search term
   * @param {string} location - location to filter businesses to relevant results
   * @returns {Object} - query params needed for interaction with Yelp API
  */
  generateParams(url, term, location) {
    let params = {
      oauth_consumer_key: this.consumer_key,
      oauth_token: this.token,
      oauth_nonce: this.generateNonce(),
      oauth_timestamp: new Date().getTime(),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback: 'cb',
      location: location,
      term: term,
      limit: "1"
    }
    params.oauth_signature = oauthSignature.generate('GET',url, params, this.consumer_secret, this.token_secret);
    return params;
  }

  /**
   * Search for businesses using Yelp API
   * @param {string} - search term
   * @param {string} - location to obtain only relevant results
   * @returns {Object} - jquery promise with results
  */
  search(term, location){
    let url = `${this.base_url}/search`;
    return $.ajax({
      url: url,
      data: this.generateParams(url, term, location),
      cache: true,
      dataType: 'jsonp'
    });
  }
}

export default Yelp;
