import React, { Component } from 'react';
import logo from './logo.svg';
import Sidebar from './components/Sidebar/Sidebar';
import GoogleMap from './components/GoogleMap/GoogleMap';
import { connect } from 'react-redux';
import { setLocation, loadRestaurants} from './actions/actionCreators';

class App extends Component {
  componentDidMount(){
    if ("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        this.props.setLocation(position.coords.latitude,position.coords.longitude);
        this.props.loadRestaurants();
      });
    }
  }

  /*
  setActiveRestaurant(index){
      this.setState({ activeRestaurantIndex: index });
      const currentRestaurant = this.state.restaurants[index];

      if(currentRestaurant.hasOwnProperty("business_details")){
        return;
      }

      const url = `${YELP_BUSINESS_URL}/${currentRestaurant.id}`
      fetch(url).then((response) => {
        response.json().then((result) => {
          //console.log(result);
          let updated_restaurants = this.state.restaurants.slice();
          updated_restaurants[index].business_details = result;
          this.setState({
            restaurants: updated_restaurants
          });
        });
      });
  }

  setFilterText(event){
    this.setState({ filterText: event.target.value});
  }

  filteredRestaurants(){
    const restaurants = this.state.restaurants;
    return restaurants && restaurants.filter((restaurant) => {
      return restaurant.name.includes(this.state.filterText);
    });
  }
  */
  render() {
    return (
      <div className="container-fluid">
        <div className="App">
          <div className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h2>Welcome to React</h2>
          </div>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
        <div className="row">
          <div className="col-4">
            <Sidebar />
          </div>
          <div className="col-8">
            { /*
            <GoogleMap restaurants={this.filteredRestaurants()}
                       activeRestaurantIndex={this.state.activeRestaurantIndex}
            /> */ }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setLocation: (latitude,longitude) => dispatch(setLocation(latitude,longitude)),
    loadRestaurants: () => dispatch(loadRestaurants())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
