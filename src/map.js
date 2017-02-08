import FLICKR_CONFIG from './config/flickr.json';
import YELP_CONFIG from './config/yelp.json';
import INFO_WINDOW_TEMPLATE from './config/infoWindowTemplate';
import Model from './model';
import Restauraunt from './classes/Restauraunt';
import Yelp from './classes/Yelp';
import Flickr from './classes/Flickr';
import {animateMarker} from './helpers/helpers';
import ko from 'knockout';

let yelp = new Yelp(YELP_CONFIG);
let flickr = new Flickr(FLICKR_CONFIG);
let map = null;
let service = null;
let infoWindow = null;
let infoWindowNode = $("#infoWindow");

function AppViewModel(){
  let self = this;

  self.restauraunts = ko.observableArray(Model.restauraunts.map((restauraunt) => {
    return new Restauraunt(restauraunt.name, restauraunt.address);
  }));

  self.errors = ko.observableArray([]);
  self.currentRestaurauntIndex = ko.observable();
  self.currentRestauraunt = ko.computed(function() {
    return self.restauraunts()[self.currentRestaurauntIndex()];
  })
  self.filterText = ko.observable("");

  self.filteredRestaunts = ko.observableArray(self.restauraunts());
  console.log(self.filteredRestaunts().map(function(item){ return item.name() }));
  self.filterRestauraunts = function(form){
    console.log(self.filteredRestaunts().map(function(item){ return item.name() }));
    self.filteredRestaunts(self.restauraunts().filter(function(item){
      console.log(`item name ${item.name()} - ${self.filterText()} - ${item.name().includes(self.filterText())}`)
      return item.name().toLowerCase().includes(self.filterText().toLowerCase());
    }));
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
        flickr.searchPhotos(location.lat(), location.lng(), nextRestauraunt.name());
    }

    // animate the marker whenever it is clicked on the map
    animateMarker(marker);
    //infoWindow.setContent($('#infoWindow').html());
    infoWindow.open(map, marker);
  })

  self.jsonFlickrApi = function(results){
    if(!results["stat"] || results["stat"] != "ok"){
      self.errors.push('Something went wrong while trying to fetch flickr photos');
      return;
    }

    let flickrImages = results["photos"]["photo"].map(function(photo){
      return flickr.buildFlickrPhotoURL(photo.farm, photo.server, photo.id, photo.secret);
    });

    self.currentRestauraunt().flickr_images(flickrImages);
  }

  self.initMap = function(){
    map = (new google.maps.Map(document.getElementById("map"), {
        zoom:14,
        center: Model.starting_point
    }));
    infoWindow = (new google.maps.InfoWindow({
        content: infoWindowNode[0]
    }));

    google.maps.event.addListener(infoWindow, "closeclick", function() {
      //console.log('closing_window');
       $("body").append(infoWindowNode);
    });

    service = (new google.maps.places.PlacesService(map));
    self.initApp();
  }

  self.initApp = function(){
    if(!self.service){
      // do something with an error here
    }

    self.restauraunts().forEach(function(restauraunt,index){
      let request = {
        location: Model.starting_point,
        radius: 15000,
        keyword: restauraunt.address()
      };
      //console.log(request);
      service.nearbySearch(request, self.serviceCallback.bind(null,restauraunt,index));
    });
  }

  self.serviceCallback = function callback(restauraunt, index, results, status){
    if (status != google.maps.places.PlacesServiceStatus.OK){
      self.errors.push(`Something went wrong while trying to fetch details about ${restauraunt.name} from Google Maps API`);
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
      self.currentRestaurauntIndex( );
    });
  }
}

let vm = new AppViewModel();

// Need to add callbacks to window since es6 functions are not global
window.initMap = vm.initMap;
window.jsonFlickrApi = vm.jsonFlickrApi;

ko.applyBindings(vm);
