import { useEffect, useState } from "react";
import MapView from "../../components/MapComponents/MapView";
import LocationInput from "../../components/MapComponents/LocationInput";
import RouteInfo from "../../components/MapComponents/RouteInfo";
import { useCurrentLocation } from "../../services/useCurrentLocation";
import { getRouteData } from "../../services/routingService";
import "./MapPage.scss";
import Header from "../../components/Header/Header";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const BookingMapPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dest_name = state?.dest_name;
  const {
    location: pickup,
    address: pickupAddress,
    loading,
  } = useCurrentLocation();
  const [drop, setDrop] = useState(null);
  const [dropCord, setDropCord] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const RATE_PER_KM = 1; // €1 per KM

  const price = distance ? (distance * RATE_PER_KM).toFixed(2) : null;
  useEffect(() => {
    const fetchRoute = async () => {
      if (pickup && dropCord) {
        const data = await getRouteData(pickup, dropCord);
        setRoute(data.coordinates);
        setDistance(data.distance);
        setDuration(data.duration);
      }
    };

    fetchRoute();
  }, [pickup, dropCord]);
  const handleBooking = () => {
    const bookingData = {
      pickup_address: pickupAddress,
      pickup_lat: pickup[0],
      pickup_long: pickup[1],
      drop_address: drop,
      drop_lat: dropCord[0],
      drop_long: dropCord[1],
      distance,
      duration,
      price,
    };
    localStorage.setItem("booking_data", JSON.stringify(bookingData));
    navigate("/checkout", {
      state: bookingData,
    });
  };
  const handleDropLocation = (cord, addr) => {
    // console.log("cord ", cord);
    // console.log("addr ", addr);
    setDrop(addr);
    setDropCord(cord);
  };
  return (
    <div className="bookmap-wrapper">
      <Header />
      <div className="bookingmap-page">
        <div className="map-section">
          <MapView pickup={pickup} drop={dropCord} route={route} />
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

            <LocationInput
              label="Drop Location"
              onSelect={handleDropLocation}
            />
          </div>

          <RouteInfo distance={distance} duration={duration} price={price} />
          <button
            className="book-btn"
            disabled={!pickup || !drop}
            onClick={handleBooking}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingMapPage;
