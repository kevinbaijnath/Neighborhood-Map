/** Class representing a Restauraunt */
class Restauraunt {
  /**
   * Creates a new Restauraunt
   * @constructor
   * @param {string} name - Name of the Restauraunt
   * @param {string} address - Address of the Restauraunt
  */
  constructor(name, address){
    this.name = name;
    this.address = address;
    this.marker = null;
    this.yelp_url = "";
    this.yelp_img_url = "";
    this.flickr_images = [];
  }
}

export default Restauraunt;
