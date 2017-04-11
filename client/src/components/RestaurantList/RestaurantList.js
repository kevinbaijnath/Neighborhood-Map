import React, { Component } from 'react';
import './RestaurantList.css';

class RestaurantList extends Component {
    render(){
        return (
            <ul className="list-group">
                {
                 this.props.restaurants.map((restaurant, index) => {
                    return (<li className={this.props.activeRestaurantIndex === index ? "list-group-item active" : "list-group-item" }
                                key={restaurant.id} 
                                onClick={() => {this.props.setActiveRestaurant(index)}}>
                            {restaurant.name}</li>);
                 })
                }
            </ul>
        )
    }
}

export default RestaurantList