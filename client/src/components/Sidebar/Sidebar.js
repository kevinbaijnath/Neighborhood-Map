import React, { Component } from 'react';
import RestaurantList from '../RestaurantList/RestaurantList';

class Sidebar extends Component {
    render(){
        return (
            <div>
                <form className="form-inline">
                    <input type="text" className="form-control" placeholder="Enter a Location" />
                    <button type="submit" className="btn btn-primary">Update</button>
                </form>
                <div className="form-inline">
                  <input className="form-control" type="text" placeholder="Filter Text" onChange={this.props.setFilterText} />
                </div>
                <RestaurantList restaurants={this.props.restaurants} 
                                setActiveRestaurant={this.props.setActiveRestaurant} 
                                activeRestaurantIndex={this.props.activeRestaurantIndex}
                />
            </div>
        );
    }
}

export default Sidebar