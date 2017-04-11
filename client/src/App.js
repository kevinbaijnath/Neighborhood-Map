import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import GoogleMap from './components/GoogleMap/GoogleMap';
import { YELP_SEARCH_URL, YELP_BUSINESS_URL } from './config/constants';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
            activeRestaurantIndex: -1,
            restaurants: [],
            filterText: "",
            location: {
              latitude: null,
              longitude: null
            }
    }

    this.filteredRestaurants = this.filteredRestaurants.bind(this);
  }

  componentDidMount(){
    if ("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          location: {
            "latitude": position.coords.latitude,
            "longitude": position.coords.longitude
          }
        });
      }, (error) => {
        alert("unable to find position");
      });
    }
  }

  componentDidUpdate(prevProps, prevState){
    if((prevState.location.latitude !== this.state.location.latitude) ||
       (prevState.location.longitude !== this.state.location.longitude)){
        const url = `${YELP_SEARCH_URL}?latitude=${this.state.location.latitude}&longitude=${this.state.location.longitude}`;
        fetch(url).then((response) => {
          response.json().then((result) => {
            this.setState({
              restaurants: result.businesses
            });
            console.log(result);
          })
        }).catch(function(error){
          console.log(error)
        });
    }
  }
  
  setActiveRestaurant(index){
      this.setState({ activeRestaurantIndex: index });
      const currentRestaurant = this.state.restaurants[index];
      const url = `${YELP_BUSINESS_URL}/${currentRestaurant.id}`
      fetch(url).then((response) => {
        response.json().then((result) => {
          console.log(result);
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
            <Sidebar restaurants={this.filteredRestaurants()} 
                     activeRestaurantIndex={this.state.activeRestaurantIndex}
                     setActiveRestaurant={this.setActiveRestaurant.bind(this)}
                     filterText={this.state.filterText}
                     setFilterText={this.setFilterText.bind(this)}
            />
          </div>
          <div className="col-8">
            <GoogleMap restaurants={this.filteredRestaurants()} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
