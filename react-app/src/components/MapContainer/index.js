import React from 'react';
import './MapContent.css';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

export function MapContainer({ google, business }) {
  const mapStyles = {
    width: '300px',
    height: '240px',
  };

  return (
    <div className="custom-google-map-container" style={mapStyles}>
      <Map
        google={google}
        zoom={14}
        style={mapStyles}
        key={business.id}
        initialCenter={{
          lat: business.latitude,
          lng: business.longitude,
        }}
      >
        <Marker position={{ lat: business.latitude, lng: business.longitude }} />
      </Map>
    </div>
  );
}

export default GoogleApiWrapper({
  apiKey: API_KEY,
})(MapContainer);
