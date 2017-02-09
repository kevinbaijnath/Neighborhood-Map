import ko from 'knockout';

/** Class representing a Restauraunt */
class Restauraunt {
  /**
   * Creates a new Restauraunt
   * @constructor
   * @param {string} name - Name of the Restauraunt
   * @param {string} address - Address of the Restauraunt
  */
  constructor(name, address){
    this.name = ko.observable(name);
    this.address = ko.observable(address);
    this.marker = ko.observable();
    this.yelp_url = ko.observable();
    this.yelp_img_url = ko.observable();
    this.flickr_images = ko.observableArray();
  }
}

export default Restauraunt;
