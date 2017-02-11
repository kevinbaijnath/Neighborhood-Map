import FLICKR_CONFIG from './config/flickr.json';
import YELP_CONFIG from './config/yelp.json';
import INFO_WINDOW from './config/infowindow';
import Model from './model';
import Restaurant from './classes/restaurant';
import Yelp from './classes/yelp';
import Flickr from './classes/flickr';
import {animateMarker} from './helpers/helpers';
import ko from 'knockout';

//constants
const YELP = new Yelp(YELP_CONFIG);
const FLICKR = new Flickr(FLICKR_CONFIG);

// Google Maps Variables
let map = null;
let service = null;
let infoWindow = null;

/**
 * View Model for the application
*/
function AppViewModel(){
  let self = this;

  // state variables
  self.restaurants = ko.observableArray(Model.restaurants.map((restaurant) => {
    return new Restaurant(restaurant.name, restaurant.address);
  }));
  self.errors = ko.observableArray([]);
  self.currentRestaurant = ko.observable();
  self.filterText = ko.observable('');
  self.filteredRestaurants = ko.computed(function(){
    return self.restaurants().filter(function(item){
      return item.name().toLowerCase().includes(self.filterText().toLowerCase());
    });
  }, self);
  self.filteredRestaurants.subscribe(function(newFilteredRestaurants){
    self.restaurants().forEach(function(restaurant){
      restaurant.marker().setVisible(newFilteredRestaurants.includes(restaurant));
    });
  });

  /*
   * Sets currentRestaurant to the restaurant that was clicked
  */
  self.clickListItem = function(restaurant){
    self.currentRestaurant(restaurant);
  }

  /*
   * Populates the current restaurant with yelp and flickr informatio and opens
   * the infoWindow for the corresponding marker
  */
  self.currentRestaurant.subscribe(function(nextRestaurant){
    let marker = nextRestaurant.marker();
    let location = marker.place.location;
    if(!nextRestaurant.yelp_url()){
      YELP.search(nextRestaurant.name(), nextRestaurant.address())
      .done(function(results){
        if(results['businesses'] && results['businesses'].length > 0){
          nextRestaurant.yelp_url(results.businesses[0].url);
          nextRestaurant.yelp_img_url(results.businesses[0].rating_img_url);
        }else{
          self.errors.push('No data was returned from the Yelp API');
        }
      })
      .fail(function(error){
        self.errors.push('Something went wrong while trying to fetch data from Yelp API');
      });
    }

    if(nextRestaurant.flickr_images().length == 0){
        FLICKR.searchPhotos(location.lat(), location.lng(), nextRestaurant.name())
        .then(function(results){
          if(!results['stat'] || results['stat'] != 'ok'){
            self.errors.push('Something went wrong while trying to fetch flickr photos');
            return;
          }

          let flickrImages = results['photos']['photo'].map(function(photo){
            return {
              small: FLICKR.buildFlickrPhotoURL(photo.farm, photo.server, photo.id, photo.secret, 'small'),
              thumbnail: FLICKR.buildFlickrPhotoURL(photo.farm, photo.server, photo.id, photo.secret, 'thumbnail')
            }
          });

          self.currentRestaurant().flickr_images(flickrImages);
        })
        .fail(function(error){
          console.log(error);
          self.errors.push('Something went wrong while trying to fetch flickr photos');
        })
    }

    // animate the marker whenever it is clicked on the map
    animateMarker(marker);
    map.setCenter(location);
    infoWindow.open(map, marker);
    console.log(INFO_WINDOW);
  })

  /*
   * Populates the application with initial data from the model
  */
  self.initApp = function(){
    self.restaurants().forEach(function(restaurant,index){
      let request = {
        location: Model.starting_point,
        radius: 15000,
        keyword: restaurant.address()
      };
      service.nearbySearch(request, self.serviceCallback.bind(null,restaurant,index));
    });
  }

  /*
   * Creates and adds a marker to each restaurant
  */
  self.serviceCallback = function callback(restaurant, index, results, status){
    if (status != google.maps.places.PlacesServiceStatus.OK){
      self.errors.push(`Something went wrong while trying to fetch restaurant details from Google Maps API`);
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

    self.restaurants()[index].marker(marker);

    google.maps.event.addListener(marker, 'click', function(){
      self.currentRestaurant(restaurant);
    });
  }

  /**
   * Function that gets run when there is an error with google maps
  */
  self.mapError = function(){
    self.errors.push('Error loading google maps');
  }
}

let vm = new AppViewModel();

/*
 * Callback function that gets invoked when google maps is initialized
*/
function initMap(){
  map = (new google.maps.Map(document.getElementById('map'), {
      zoom:14,
      center: Model.starting_point
  }));
  infoWindow = (new google.maps.InfoWindow({
      content: INFO_WINDOW
  }));

  service = (new google.maps.places.PlacesService(map));
  vm.initApp();
}

// Need to add callbacks to window since es6 functions are not global
window.initMap = initMap;
window.mapError = vm.mapError;

ko.applyBindings(vm);
