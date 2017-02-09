/** Class for interacting with Flickr API */
class Flickr {
  /**
   * Create a Flickr Object
   * @constructor
   * @param {Object} config - Configuration object that contains Flickr details
   * @param {string} config.key - Flickr key
   * @param {string} config.secret - Flickr secret
  */
  constructor(config){
    this.key = config.key;
    this.secret = config.secret;
  }

  /**
   * Generate a Flickr URL
   * @param {string} farm_id - id of the farm that has the photo
   * @param {string} server_id - id of the server that has the photo
   * @param {string} id - id of the photo
   * @param {string} secret - secret associated with the photo
   * @returns {string} url that has the flickr photo
  */
  buildFlickrPhotoURL(farm_id, server_id, id, secret){
    return `https://farm${farm_id}.staticflickr.com/${server_id}/${id}_${secret}_n.jpg`;
  }

  /**
   * Search for Flickr photos
   * @param {number} lat - latitude to search
   * @param {number} lon - longitude to search
   * @param {string} search_term - search term to filter out photos to relevant photos
   * @param {Object} - jquery promise with results
  */
  searchPhotos(lat, lon, search_term){
    let url = 'https://api.flickr.com/services/rest';
    let params = {
      method: "flickr.photos.search",
      text: search_term,
      api_key: this.key,
      privacy_filter: "1",
      lat: lat,
      lon: lon,
      per_page: 5,
      format: "json",
      radius: 1,
      nojsoncallback: 1
    }
    return $.ajax({
      url: url,
      data: params,
      dataType: 'json'
    });
  }
}

export default Flickr;
