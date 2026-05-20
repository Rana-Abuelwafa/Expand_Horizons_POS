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
  //iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const MapView = ({ pickup, drop, route }) => {
  const mapRef = useRef();
  if (!pickup) return <p>Loading map...</p>;
  //console.log("pick", pickup);
  return (
    <MapContainer
      center={pickup}
      zoom={10}
      style={{ height: "100%", width: "100%" }}
      //whenCreated={handleMapLoad}
      ref={mapRef}
    >
      {/* //english map */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; OpenStreetMap contributors &copy; CARTO"
      />
      {/* //arabic map view */}
      {/* <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      /> */}
      {/* <TileLayer
  url="https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
/> */}
      {pickup && <Marker position={pickup} icon={customIcon} />}
      {drop && <Marker position={drop} icon={customIcon} />}
      {route?.length > 0 && <Polyline positions={route} />}
    </MapContainer>
  );
};

export default MapView;
