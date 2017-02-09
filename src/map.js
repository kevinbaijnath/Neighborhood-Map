import FLICKR_CONFIG from './config/flickr.json';
import YELP_CONFIG from './config/yelp.json';
import Model from './model';
import Restauraunt from './classes/Restauraunt';
import Yelp from './classes/Yelp';
import Flickr from './classes/Flickr';
import {animateMarker} from './helpers/helpers';
import ko from 'knockout';

const yelp = new Yelp(YELP_CONFIG);
const flickr = new Flickr(FLICKR_CONFIG);

// Google Maps Variables
let map = null;
let service = null;
let infoWindow = null;
const infoWindowNode = $("#infoWindow");

function AppViewModel(){
  let self = this;

  self.restauraunts = ko.observableArray(Model.restauraunts.map((restauraunt) => {
    return new Restauraunt(restauraunt.name, restauraunt.address);
  }));

  self.errors = ko.observableArray([]);

  self.currentRestauraunt = ko.observable();
  self.filterText = ko.observable("");

  self.filteredRestaunts = ko.observableArray(self.restauraunts());
  self.filteredRestaunts.subscribe(function(newFilteredRestauraunts){
    self.restauraunts().forEach(function(restauraunt){
      if(newFilteredRestauraunts.includes(restauraunt)){
        restauraunt.marker().setMap(map);
      }else{
        restauraunt.marker().setMap(null);
      }
    });
  });

  self.clickListItem = function(restauraunt){
    self.currentRestauraunt(restauraunt);
  }

  self.filterRestauraunts = function(form){
    self.filteredRestaunts(self.restauraunts().filter(function(item){
      return item.name().toLowerCase().includes(self.filterText().toLowerCase());
    }));
    //console.log(self.filteredRestaunts().map(function(item){ return item.name()}));
  }

  self.currentRestauraunt.subscribe(function(nextRestauraunt){
    let marker = nextRestauraunt.marker();
    let location = marker.place.location;
    if(!nextRestauraunt.yelp_url()){
      yelp.search(nextRestauraunt.name(), nextRestauraunt.address())
      .done(function(results){
        if(results["businesses"] && results["businesses"].length > 0){
          nextRestauraunt.yelp_url(results.businesses[0].url);
          nextRestauraunt.yelp_img_url(results.businesses[0].rating_img_url);
        }
      })
      .fail(function(error){
        self.errors.push('Something went wrong while trying to fetch data from Yelp API');
      });
    }

    if(nextRestauraunt.flickr_images().length == 0){
        flickr.searchPhotos(location.lat(), location.lng(), nextRestauraunt.name())
        .then(function(results){
          if(!results["stat"] || results["stat"] != "ok"){
            self.errors.push('Something went wrong while trying to fetch flickr photos');
            return;
          }

          let flickrImages = results["photos"]["photo"].map(function(photo){
            return flickr.buildFlickrPhotoURL(photo.farm, photo.server, photo.id, photo.secret);
          });

          self.currentRestauraunt().flickr_images(flickrImages);
        })
        .fail(function(error){
          self.errors.push('Something went wrong while trying to fetch flickr photos');
        })
    }

    // animate the marker whenever it is clicked on the map
    animateMarker(marker);
    infoWindow.open(map, marker);
  })

  self.jsonFlickrApi = function(results){
    console.log(results["stat"]);

  }

  self.initApp = function(){
    self.restauraunts().forEach(function(restauraunt,index){
      let request = {
        location: Model.starting_point,
        radius: 15000,
        keyword: restauraunt.address()
      };
      service.nearbySearch(request, self.serviceCallback.bind(null,restauraunt,index));
    });
  }

  self.serviceCallback = function callback(restauraunt, index, results, status){
    if (status != google.maps.places.PlacesServiceStatus.OK){
      self.errors.push(`Something went wrong while trying to fetch restauraunt details from Google Maps API`);
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

    self.restauraunts()[index].marker(marker);

    google.maps.event.addListener(marker, 'click', function(){
      self.currentRestauraunt(restauraunt);
    });
  }

  self.mapError = function(){
    self.errors.push('Error loading google maps');
  }
}

let vm = new AppViewModel();

function initMap(){
  map = (new google.maps.Map(document.getElementById("map"), {
      zoom:14,
      center: Model.starting_point
  }));
  infoWindow = (new google.maps.InfoWindow({
      content: infoWindowNode[0]
  }));

  service = (new google.maps.places.PlacesService(map));
  vm.initApp();
}

// Need to add callbacks to window since es6 functions are not global
window.initMap = initMap;
window.mapError = vm.mapError;

ko.applyBindings(vm);
