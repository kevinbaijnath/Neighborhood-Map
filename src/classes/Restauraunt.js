import ko from 'knockout';

export default class Restauraunt {
  constructor(name, address){
    this.name = ko.observable(name);
    this.address = ko.observable(address);
    this.marker = ko.observable();
    this.yelp_url = ko.observable();
    this.yelp_img_url = ko.observable();
    this.flickr_images = ko.observableArray();
  }

  setMarker(marker){
    this.marker(marker);
  }

  setYelpURL(url){
    this.yelp_url(url);
  }

  setYelpImgURL(url){
    this.yelp_img_url(url);
  }

  setFlickrImages(images){
    this.flickr_images(images);
  }
}
