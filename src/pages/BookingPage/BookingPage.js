import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import ContactPage from "../../components/BookingSteps/ContactStep/index";
import { clearBookingSummary } from "../../redux/Slices/bookingSummarySlice";
const BookingPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [tripData, setTripData] = useState(null);
  const [tripType, setTripType] = useState(1);

  const [availabilityData, setAvailabilityData] = useState(null);
  const [childAges, setchildAges] = useState(null);

  useEffect(() => {
    if (state?.trip) {
      setTripData(state.trip);
      setTripType(state.trip.trip_type || 1);
    }

    if (state?.availabilityData) {
      setAvailabilityData(state?.availabilityData);
    }

    if (state?.childAges) {
      setchildAges(state?.childAges);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clean up when component unmounts
    return () => {
      dispatch(clearBookingSummary());
    };
  }, [state, dispatch]);

  return (
    <div className="dest-wrapper">
      <div className="dest-container">
        <Header />
        <ContactPage
          tripData={tripData}
          availabilityData={availabilityData}
          childAges={childAges}
        />
      </div>
    </div>
  );
};

export default BookingPage;
