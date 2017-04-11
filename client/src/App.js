import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
            activeRestaurantIndex: -1,
            restaurants: ['test1','test2','test3'],
            filterText: "",
            location: null
    }
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
        
    }
  }
  
  setActiveRestaurant(index){
      this.setState({ activeRestaurantIndex: index });
  }

  setFilterText(event){
    this.setState({ filterText: event.target.value});
  }

  filteredRestaurants(){
    return this.state.restaurants.filter((restaurant) => {
      return restaurant.includes(this.state.filterText);
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
            The map goes here
          </div>
        </div>
      </div>
    );
  }
}

export default App;
