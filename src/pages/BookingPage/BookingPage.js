import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import Header from "../../components/Header/Header";

const BookingPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [tripData, setTripData] = useState(null);
  const [tripType, setTripType] = useState(1);

  useEffect(() => {
    if (state?.trip) {
      setTripData(state.trip);
      setTripType(state.trip.trip_type || 1);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

  }, [state, dispatch]);

  return (
    <div className="dest-wrapper">
      <div className="dest-container">
      <Header />
    </div>
    </div>
  );
};

export default BookingPage;