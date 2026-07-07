import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import React, { useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = L.icon({
  iconUrl: "./images/blue_marker.png",
  iconAnchor: [15, 40],
});

// Renders pickup/drop markers and route polyline on the map.
const MapView = ({ pickup, drop, route }) => {
  const mapRef = useRef();
  if (!pickup) return <p>Loading map...</p>;
  return (
    <MapContainer
      center={pickup}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
      />
      
      
      
      {pickup && <Marker position={pickup} icon={customIcon} />}
      {drop && <Marker position={drop} icon={customIcon} />}
      {route?.length > 0 && <Polyline positions={route} />}
    </MapContainer>
  );
};

export default MapView;
