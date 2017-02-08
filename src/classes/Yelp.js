import oauthSignature from 'oauth-signature';

export default class Yelp {
  constructor(config){
    this.consumer_key = config.consumer_key;
    this.consumer_secret = config.consumer_secret;
    this.token = config.token;
    this.token_secret = config.token_secret
    this.base_url = config.base_url;
  }

  generateNonce() {
    return (Math.floor(Math.random() * 1e12).toString());
  }

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

  search(term, location){
    let url = `${this.base_url}/search`;
    console.log('searching');
    return $.ajax({
      url: url,
      data: this.generateParams(url, term, location),
      cache: true,
      dataType: 'jsonp'
    });
  }
}

/*
,
success: function(results) {
  if(results["businesses"] && results["businesses"].length > 0){
    let business = results.businesses[0];
    $("#yelp_link").attr('href',business.url);
    $("#yelp_rating").attr('src',business.rating_img_url);
    $('#name').text(term);
    $('#address').text(location);
  } else {
    addErrorAlert(`Unable to find business ${term} through yelp api`);
  }
},
fail: function(errval) {
  addErrorAlert('Something went wrong while trying to fetch from the yelp api');
}
*/
