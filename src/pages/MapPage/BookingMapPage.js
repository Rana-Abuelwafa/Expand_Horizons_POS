import { useEffect, useState } from "react";
import MapView from "../../components/MapComponents/MapView";
import LocationInput from "../../components/MapComponents/LocationInput";
import RouteInfo from "../../components/MapComponents/RouteInfo";
import { useCurrentLocation } from "../../services/useCurrentLocation";
import { getRouteData } from "../../services/routingService";
import "./MapPage.scss";
import Header from "../../components/Header/Header";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookingMapPage = () => {
  const navigate = useNavigate();
  const {
    location: pickup,
    address: pickupAddress,
    loading,
  } = useCurrentLocation();
  const [drop, setDrop] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const RATE_PER_KM = 1; // €1 per KM

  const price = distance ? (distance * RATE_PER_KM).toFixed(2) : null;
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickup && drop) {
        const data = await getRouteData(pickup, drop);
        setRoute(data.coordinates);
        setDistance(data.distance);
        setDuration(data.duration);
      }
    };

    fetchRoute();
  }, [pickup, drop]);

  return (
    <div className="bookmap-wrapper">
      <Header />
      <div className="bookingmap-page">
        <div className="map-section">
          <MapView pickup={pickup} drop={drop} route={route} />
        </div>

        <div className="details-section">
          <div className="inputs">
            <h3>
              <FaMapMarkerAlt className="pick_marker" />
              Pickup:{" "}
              {pickupAddress != null
                ? pickupAddress
                : localStorage.getItem("pickup_address")}
            </h3>

            <LocationInput label="Drop Location" onSelect={setDrop} />
          </div>

          <RouteInfo distance={distance} duration={duration} price={price} />
          <button
            className="book-btn"
            disabled={!pickup || !drop}
            onClick={() => {
              navigate("/checkout");
            }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingMapPage;
