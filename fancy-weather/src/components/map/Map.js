import React from 'react';
import mapboxgl from 'mapbox-gl';
import * as constants from '../../helpers/constants/constants';

class Map extends React.Component {
  componentDidMount() {
    this.lat = this.props.state.lat;
    this.lng = this.props.state.lng;
    mapboxgl.accessToken = constants.tokens.mapbox;
    let map = new mapboxgl.Map({
    container: this.mapContainer, // container id
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [this.props.state.lat, this.props.state.lng], // starting position [lng, lat]
    zoom: 10 // starting zoom
    });
    this.map = map;
  }
  
  componentDidUpdate() {
    if (this.props.state.lat !== this.lat || this.props.state.lng !== this.lng) {
      this.lat = this.props.state.lat;
      this.lng = this.props.state.lng;
      this.map.flyTo({
        center: [
          this.props.state.lng,
          this.props.state.lat,
        ],
        essential: true,
        zoom: 10
      });
    }
  }

  render () {
    return (
    <div className = "map">
      <div className = "coords">
        <div>{`${this.props.state.localisations[`${this.props.state.language}`].lat} ${this.props.state.lat}`}</div>
        <div>{`${this.props.state.localisations[`${this.props.state.language}`].lng} ${this.props.state.lng}`}</div>
      </div>
      <div ref={el => this.mapContainer = el} className="mapContainer" />
    </div>
    )
  }
}

export default Map;