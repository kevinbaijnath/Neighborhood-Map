import * as ActionTypes from '../config/actionTypes';
import { YELP_SEARCH_URL, YELP_BUSINESS_URL } from '../config/applicationConstants';

export function setRestaurants(restaurants){
    return {
        type: ActionTypes.FETCH_RESTAURANTS,
        restaurants
    }
}

export function loadRestaurants(){
    return function(dispatch, getState){
        const state = getState();
        let url = `${YELP_SEARCH_URL}?latitude=${state.location.latitude}&longitude=${state.location.longitude}`;

        return fetch(url)
               .then(function(response){
                   return response.json()
               }).then(function(jsonResponse){
                   dispatch(setRestaurants(jsonResponse.businesses));
               });
    }
}

export function setRestaurantDetails(restaurant_id, restaurant_details){
    return {
        type: ActionTypes.FETCH_RESTAURANT_DETAILS,
        restaurant_id: restaurant_id,
        restaurant_details: restaurant_details
    }
}

export function loadRestaurantDetails(){
    return function(dispatch, getState){
        const state = getState();
        if(state.activeRestaurantIndex){
            let business_id = state.restaurants[state.activeRestaurantIndex].id;
            let url = `${YELP_BUSINESS_URL}/${business_id}`;
            return fetch(url)
                   .then(function(response){
                       return response.json();
                   }).then(function(jsonResponse){
                       const keys = Object.keys(jsonResponse);
                       const values = Object.values(jsonResponse);
                       if(keys.length !== 1 || values.length !== 1){
                           throw { "test": "test"}
                       }
                       dispatch(setRestaurantDetails(keys[0],values[0]));
                   });
        }
    }
}

export function setFilterText(text){
    return {
        type: ActionTypes.SET_FILTER_TEXT,
        text: text
    }
}

export function setLocation(latitude,longitude){
    return {
        type: ActionTypes.SET_LOCATION,
        latitude: latitude,
        longitude: longitude
    }
}

export function setActiveRestaurantIndex(index){
    return {
        type: ActionTypes.SET_ACTIVE_RESTAURANT_INDEX,
        index: index
    }
}

export function updateActiveRestaurant(index){
    return function(dispatch, getState){
        const state = getState();
        const active_restaurant = state.restaurants[index];
        const restaurant_details = state.restaurant_details;
        dispatch(setActiveRestaurantIndex(index));
        if(!restaurant_details || !restaurant_details.hasOwnProperty(active_restaurant.id)){
            dispatch(loadRestaurantDetails());
        }
    }
}