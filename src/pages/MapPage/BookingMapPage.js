import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MapView from "../../components/MapComponents/MapView";
import LocationInput from "../../components/MapComponents/LocationInput";
import RouteInfo from "../../components/MapComponents/RouteInfo";
import { getRouteData } from "../../services/routingService";
import Header from "../../components/Header/Header";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Alert, Form } from "react-bootstrap";

// Handles transfer map booking flow from location selection to checkout handoff.
const BookingMapPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const defaultPickup = [26.845, 33.99];
  const defaultPickupAddress = "Jaz Soma Beach, Soma Bay, Red Sea, Egypt";

  const [routeErr, setRouteErr] = useState(null);
  const [pickup, setPickup] = useState(defaultPickup);
  const [pickupAddress, setPickupAddress] = useState(defaultPickupAddress);
  const [drop, setDrop] = useState(null);
  const [dropCord, setDropCord] = useState(null);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [isTwoWay, setIsTwoWay] = useState(false);
  const RATE_PER_KM = 1; // €1 per KM

  const price = distance ? (distance * RATE_PER_KM).toFixed(2) : null;

  const totalPrice = isTwoWay ? (price * 2).toFixed(2) : price;

  // Recomputes route summary whenever pickup/drop locations change.
  useEffect(() => {
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

        setRouteErr(err.message);
      }
    };
    fetchRoute();
  }, [pickup, dropCord]);

  // Stores map booking draft and forwards it to checkout page.
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

  // Receives selected dropoff coordinates/address from search input.
  const handleDropLocation = (cord, addr) => {
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
          {routeErr && <Alert variant={"danger"}>{routeErr}</Alert>}
          <div className="inputs">
            <div className="pickup-section">
              <h3>{t("bookingMap.pickupTitle")}</h3>
              <div className="fixed-pickup">
                <p className="fixed-pickup-address">
                  <FaMapMarkerAlt className="pickup-marker" />
                    {pickupAddress}
                </p>
              </div>
            </div>

            <div className="drop-section">
              <h3>
                
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
            disabled={!pickup || !dropCord || routeErr}
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
