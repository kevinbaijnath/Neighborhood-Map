import FLICKR_CONFIG from './config/flickr.json';
import YELP_CONFIG from './config/yelp.json';
import INFO_WINDOW_TEMPLATE from './config/infoWindowTemplate';
import Model from './model';
import Restauraunt from './classes/Restauraunt';
import Yelp from './classes/Yelp';
import Flickr from './classes/Flickr';
import {addErrorAlert, animateMarker} from './helpers/helpers';

let yelp = new Yelp(YELP_CONFIG);
let flickr = new Flickr(FLICKR_CONFIG);
let Restauraunts = [];
let map = null;
let service = null;
let infoWindow = null;

function jsonFlickrApi(results){
  if(!results["stat"] || results["stat"] != "ok"){
    addErrorAlert('Something went wrong while trying to fetch flickr photos');
    return;
  }
  results["photos"]["photo"].forEach(function(photo, index){
    let url = flickr.buildFlickrPhotoURL(photo.farm, photo.server, photo.id, photo.secret);
    $(`#carousel_${index}`).attr('src', url);
  });
}

function callback(name, address, results, status){
  if (status != google.maps.places.PlacesServiceStatus.OK){
    addErrorAlert(`Something went wrong while trying to fetch details about ${name} from Google Maps API`);
    return;
  }

  let marker = new google.maps.Marker({
    place: {
      placeId: results[0].place_id,
      location: results[0].geometry.location
    },
    map: map,
    animation: google.maps.Animation.DROP
  });

  google.maps.event.addListener(marker, 'click', function(){
    let location = marker.place.location;

    //map.setCenter(location);

    yelp.search(name, address);
    flickr.searchPhotos(location.lat(), location.lng(), name);
    // animate the marker whenever it is clicked on the map
    animateMarker(marker);
    infoWindow.open(map, marker);
  });

  // Once the marker is obtained for the restauraunt, add it to the global list of restauraunts
  Restauraunts.push(new Restauraunt(name,address, marker));
}

function initMap(){
  map = new google.maps.Map(document.getElementById("map"), {
      zoom:14,
      center: Model.starting_point
  });

  infoWindow = new google.maps.InfoWindow({
      content: INFO_WINDOW_TEMPLATE()
  });

  service = new google.maps.places.PlacesService(map);

  Model.restauraunts.forEach(function(location,index){
    let request = {
      location: Model.starting_point,
      radius: 15000,
      keyword: location.address
    };
    service.nearbySearch(request, callback.bind(null,location.name, location.address));
  });
}

function AppViewModel(){
  this.restauraunts = ko.observableArray();
}

// Need to add callbacks to window since webpack functions are not global
window.initMap = initMap;
window.jsonFlickrApi = jsonFlickrApi;

ko.applyBindings(new AppViewModel());
