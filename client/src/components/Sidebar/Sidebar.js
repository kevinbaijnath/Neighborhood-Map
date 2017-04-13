import React, { Component } from 'react';
import RestaurantList from '../RestaurantList/RestaurantList';
import { connect } from 'react-redux';
import {setFilterText, updateActiveRestaurant} from '../../actions/actionCreators';

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
                                activeRestaurantIndex={this.props.activeRestaurantIndex}
                                updateActiveRestaurant={this.props.updateActiveRestaurant}
                />
            </div>
        );
    }
}

const mapStateToProps = ({restaurants, activeRestaurantIndex}) => {
  return {
    activeRestaurantIndex,
    restaurants
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    setFilterText: (event) => dispatch(setFilterText(event.target.value)),
    updateActiveRestaurant: (index) => dispatch(updateActiveRestaurant(index))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);