import * as ActionCreators from './actionCreators';
import * as ActionTypes from '../config/actionTypes';

describe('setRestaurants action creator', () => {
    it('should create a fetch restaurants action', () => {
        const restaurants = ["restaurant1","restaurant2"];
        const expectedAction = {
            type: ActionTypes.FETCH_RESTAURANTS,
            restaurants
        };
        expect(ActionCreators.setRestaurants(restaurants)).toEqual(expectedAction);
    });
});

describe('setRestaurantDetails action creator', () => {
    it('should create a fetch restaurants action', () => {
        const restaurant_id = "test-restaurant";
        const restaurant_details = { "name": "Test Restaurant", "random": "test"};
        const expectedAction = {
            type: ActionTypes.FETCH_RESTAURANT_DETAILS,
            restaurant_id,
            restaurant_details
        }
        expect(ActionCreators.setRestaurantDetails(restaurant_id,restaurant_details)).toEqual(expectedAction);
    });
});

