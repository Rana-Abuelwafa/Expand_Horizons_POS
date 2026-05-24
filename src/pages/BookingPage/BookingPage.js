import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import ContactPage from "../../components/BookingSteps/ContactStep/index";
import { clearBookingSummary } from "../../redux/Slices/bookingSummarySlice";
import MapSummaryCard from "./MapSummaryCard";
const BookingPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [tripData, setTripData] = useState(null);
  const [tripType, setTripType] = useState(1);

  const [availabilityData, setAvailabilityData] = useState(null);
  const [childAges, setchildAges] = useState(null);

  const [MapData, setMapData] = useState(null);
  // const {
  //   pickup_address,
  //   pickup_lat,
  //   pickup_long,
  //   drop_address,
  //   drop_lat,
  //   drop_long,
  //   distance,
  //   duration,
  //   price,
  // } = state;
  useEffect(() => {
    if (state) {
      // ✅ case 1: came from navigation
      setMapData(state);
    } else {
      // ✅ case 2: page refresh → load from localStorage
      const stored = localStorage.getItem("booking_data");

      if (stored) {
        // setMapData(stored?.booking_data);
        setMapData(JSON.parse(stored));
      }
    }
  }, [state]);

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

  //console.log("MapData ", MapData);
  return (
    <div className="dest-wrapper">
      <div className="dest-container">
        <Header />
        <MapSummaryCard
          pickupAddress={MapData?.pickup_address}
          dropAddress={MapData?.drop_address}
          distance={MapData?.distance}
          duration={MapData?.duration}
          price={MapData?.totalPrice}
          isTwoWay={MapData?.isTwoWay}
        />
        <hr />
        <ContactPage
          tripData={tripData}
          availabilityData={availabilityData}
          childAges={childAges}
          MapData={MapData}
        />
      </div>
    </div>
  );
};

export default BookingPage;
