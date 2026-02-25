import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BiSolidCard } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { fetchToursSectionTrips } from "../../redux/Slices/tripsSlice";
import LoadingPage from "../Loader/LoadingPage";
import PopUp from "../Shared/popup/PopUp";
import TourCard from "../TourCard";
import Header from "../Header/Header";

const ToursSection = (props) => {
  const dispatch = useDispatch();
  const tripType = props.tripType || 1;
  const {
    toursSectionTrips: trips,
    loading,
    error,
  } = useSelector((state) => state.trips);
  const { user: stateUser } = useSelector((state) => state.auth); // Get user from auth state

  // Get user from localStorage as fallback
  const localStorageUser = JSON.parse(localStorage.getItem("user") || "null");
  const user = stateUser || localStorageUser;
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("error");
  const { t } = useTranslation();

  useEffect(() => {
    const params = {
      lang_code: currentLang,
      show_in_top: false,
      currency_code: "EUR",
      client_id: user?.id || "",
      trip_type: tripType,
    };
    dispatch(fetchToursSectionTrips(params));
  }, [dispatch, refreshTrigger, tripType]);

  if (loading) {
    return <LoadingPage />;
  }

  if (trips.length === 0 && !loading) {
    return (
      <section className="container-wrapper">
        <div className="center-container">
          <Header />
          <BiSolidCard className="empty-icon" />
          <h3 className="empty-title">{t("tours.empty_title")}</h3>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="container-wrapper" id="tours">
        <div className="center-container">
          <Header />
          {trips.map((trip) => (
            <div key={trip.trip_id}>
              <TourCard trip={trip} />
            </div>
          ))}
        </div>
      </section>

      {/* Single popup in the parent component */}
      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => setShowPopup(false)}
          msg={popupMessage}
          type={popupType}
          autoClose={false}
          showConfirmButton={false}
        />
      )}
    </>
  );
};

export default ToursSection;
