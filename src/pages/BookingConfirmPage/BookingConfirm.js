import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { FaRegCalendarCheck } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Shows booking success state and routes to printable confirmation.
const BookingConfirm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (state?.bookingData) {
      setBookingData(state.bookingData);
      localStorage.setItem("lastBookingData", JSON.stringify(state.bookingData));
    } else if (state?.booking_id) {
      setBookingData(state);
      localStorage.setItem("lastBookingData", JSON.stringify(state));
    } else {
      const stored = localStorage.getItem("lastBookingData");
      if (stored) {
        try {
          setBookingData(JSON.parse(stored));
        } catch (error) {
          console.error("Error parsing booking data:", error);
        }
      }
    }
  }, [state]);

  // Opens print ticket page with persisted booking payload.
  const handleViewPrint = () => {
    if (!bookingData) {
      navigate("/");
      return;
    }
    navigate("/bookingConfirmation/print", { state: { bookingData } });
  };

  return (
        <div className="booking-page">
          <div className="booking-card">
            <FaRegCalendarCheck className="booking-icon" />
            <p className="booking-message">
              {t("bookings.confirmation.title")}
            </p>
            <p className="booking-subtext">
              {t("bookings.confirmation.subtitle")}
            </p>
            <Button
              variant="primary"
              className="okBtn"
              onClick={handleViewPrint}
            >
              {t("common.viewPrint") || "View Print"}
            </Button>
          </div>
        </div>
  );
};

export default BookingConfirm;