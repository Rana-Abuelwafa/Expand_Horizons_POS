import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MapView from "../../components/MapComponents/MapView";
import LocationInput from "../../components/MapComponents/LocationInput";
import RouteInfo from "../../components/MapComponents/RouteInfo";
import { useCurrentLocation } from "../../services/useCurrentLocation";
import { getRouteData } from "../../services/routingService";
import "./MapPage.scss";
import Header from "../../components/Header/Header";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, Form } from "react-bootstrap";

const BookingMapPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const dest_name = state?.dest_name;

  const {
    location: currentLocation,
    address: currentAddress,
    loading: currentLocationLoading,
  } = useCurrentLocation();

  // Pickup state - will be set with current location as default
  const [routeErr, setRouteErr] = useState(null);
  const [pickup, setPickup] = useState(null);
  const [pickupAddress, setPickupAddress] = useState("");
  const [drop, setDrop] = useState(null);
  const [dropCord, setDropCord] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isTwoWay, setIsTwoWay] = useState(false);
  const RATE_PER_KM = 1; // €1 per KM

  const price = distance ? (distance * RATE_PER_KM).toFixed(2) : null;

  const totalPrice = isTwoWay ? (price * 2).toFixed(2) : price;
  // Set default pickup to current location when available
  useEffect(() => {
    if (currentLocation && currentAddress && !pickup) {
      setPickup(currentLocation);
      setPickupAddress(currentAddress);
    }
  }, [currentLocation, currentAddress]);

  useEffect(() => {
    // const fetchRoute = async () => {
    //   if (pickup && dropCord) {
    //     const data = await getRouteData(pickup, dropCord);
    //     setRoute(data.coordinates);
    //     setDistance(data.distance);
    //     setDuration(data.duration);
    //   }
    // };
    const fetchRoute = async () => {
      try {
        if (pickup && dropCord) {
          setRouteErr(null);
          const data = await getRouteData(pickup, dropCord);

          setRoute(data.coordinates);
          setDistance(data.distance);
          setDuration(data.duration);
        }
      } catch (err) {
        //console.log(err.message);

        // optional
        setRouteErr(err.message);
        // alert(err.message);
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
      totalPrice,
      isTwoWay,
    };
    localStorage.setItem("booking_data", JSON.stringify(bookingData));
    navigate("/checkout", {
      state: bookingData,
    });
  };

  const handlePickupLocation = (cord, addr) => {
    setPickup(cord);
    setPickupAddress(addr);
  };

  const handleDropLocation = (cord, addr) => {
    setDrop(addr);
    setDropCord(cord);
  };

  // Show loading state while getting current location
  if (currentLocationLoading) {
    return (
      <div className="bookmap-wrapper">
        <Header />
        <div className="bookingmap-page">
          <div className="loading-container">
            <p>{t("bookingMap.gettingLocation")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bookmap-wrapper">
      <Header />
      <div className="bookingmap-page">
        <div className="map-section">
          <MapView pickup={pickup} drop={dropCord} route={route} />
        </div>

        <div className="details-section">
          {routeErr && <Alert variant={"danger"}>{routeErr}</Alert>}
          <div className="inputs">
            <div className="pickup-section">
              <h3>
                {/* <FaMapMarkerAlt className="pick_marker" /> */}
                {/* // Pickup Location */}
                {t("bookingMap.pickupTitle")}
              </h3>
              <LocationInput
                label={t("bookingMap.pickupTitle")}
                onSelect={handlePickupLocation}
                defaultValue={currentAddress}
                placeholder={t("bookingMap.pickupPlaceholder")}
              />
              {pickupAddress && (
                <div className="selected-address">
                  {/* <small>Selected: {pickupAddress}</small> */}
                </div>
              )}
            </div>

            <div className="drop-section">
              <h3>
                {/* <FaMapMarkerAlt className="drop_marker" /> */}
                {t("bookingMap.dropTitle")}
              </h3>
              <LocationInput
                label={t("bookingMap.dropTitle")}
                onSelect={handleDropLocation}
                placeholder={t("bookingMap.dropPlaceholder")}
              />
            </div>
            <div className="d-flex justify-content-between">
              <Form.Group className="trip-option">
                <Form.Check
                  type="checkbox"
                  id="two-way-checkbox"
                  label={t("bookingMap.TwoWayTrip")}
                  checked={isTwoWay}
                  onChange={(e) => setIsTwoWay(e.target.checked)}
                />
              </Form.Group>
              {isTwoWay && (
                <p className="trip-note">Return trip included in total fare.</p>
              )}
            </div>
          </div>

          <RouteInfo
            distance={distance}
            duration={duration}
            price={totalPrice}
          />

          <button
            className="book-btn"
            disabled={!pickup || !dropCord}
            onClick={handleBooking}
          >
            {t("bookingMap.bookNow")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingMapPage;
