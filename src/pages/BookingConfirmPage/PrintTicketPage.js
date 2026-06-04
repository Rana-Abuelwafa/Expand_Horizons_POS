import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "react-bootstrap";
import PrintTicket from "../../components/PrintTicket/PrintTicket";
import "./PrintTicketPage.scss";

const PrintTicketPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (state?.bookingData) {
      setBookingData(state.bookingData);
      localStorage.setItem("lastBookingData", JSON.stringify(state.bookingData));
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

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="print-ticket-page">
      {bookingData ? (
        <PrintTicket bookingData={bookingData} />
      ) : (
        <div className="no-booking-data">
          <h2>{t("common.noBookingData") || "Booking data not found."}</h2>
          <p>
            {t("common.printDataMissing") ||
              "Please return to the booking page to generate your ticket."}
          </p>
          <Button variant="primary" onClick={() => navigate("/")}> 
            {t("common.backToHome") || "Back to Home"}
          </Button>
        </div>
      )}
      {bookingData && (
        <div className="print-ticket-back">
          <Button variant="outline-secondary" onClick={handleBack}>
            {t("common.backToHome") || "Back to Home"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PrintTicketPage;
