import React, { Component } from 'react';
import './RestaurantList.css';

const RestaurantList = (props) => {
    return (
        <ul className="list-group">
            {
                props.restaurants.map((restaurant, index) => {
                return (<li className={props.activeRestaurantIndex === index ? "list-group-item active" : "list-group-item" }
                            key={restaurant.id} 
                            onClick={() => { props.updateActiveRestaurant(index)}}>
                        {restaurant.name}</li>);
                })
            }
        </ul>
    )
}

export default RestaurantList;