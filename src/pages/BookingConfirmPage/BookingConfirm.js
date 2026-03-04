import React from "react";
import { Button } from "react-bootstrap";
import { FaRegCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BookingConfirm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate("/");
  };

  return (
    <div className="booking-page">
      <div className="booking-card">
        <FaRegCalendarCheck className="booking-icon" />
        <p className="booking-message">{t("bookings.confirmation.title")}</p>
        <p className="booking-subtext">{t("bookings.confirmation.subtitle")}</p>
        <Button variant="primary" className="okBtn" onClick={handleOkClick}>
          OK
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirm;