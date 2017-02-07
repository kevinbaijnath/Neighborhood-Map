export default class Flickr {
  constructor(config){
    this.key = config.key;
    this.secret = config.secret;
  }

  buildFlickrPhotoURL(farm_id, server_id, id, secret){
    return `https://farm${farm_id}.staticflickr.com/${server_id}/${id}_${secret}_n.jpg`;
  }

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
      radius: 1
    }
    $.ajax({
      url: url,
      data: params,
      dataType: 'jsonp'
    })
  }
}
