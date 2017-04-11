import React, { Component } from 'react';

class GoogleMap extends Component {
    render(){
        let index = this.props.activeRestaurantIndex;
        let output = <div></div>;
        if(index !== null && this.props.restaurants[index].hasOwnProperty('business_details')){
            const id = this.props.restaurants[index].id
            const details = this.props.restaurants[index]['business_details'][id];
            console.log(details);
            output = (
                <div>
                    <div>{details.url}</div>
                    <div>{details.address[0]+"\n"+details.address[1]}</div>
                    <div>{details.is_open_now}</div>
                </div>
            );
        }
        return (
            output
        );
    }
}

export default GoogleMap;