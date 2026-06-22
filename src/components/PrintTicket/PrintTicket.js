import React, { useRef } from "react";
import { Button, Container } from "react-bootstrap";
import { FiPrinter, FiDownload, FiSend } from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import { useDispatch } from "react-redux";
import { PrintTicketAPI } from "../../redux/Slices/TicketPrintSlice";
import jsPDF from "jspdf";
import "./PrintTicket.scss";

const PrintTicket = ({ bookingData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ticketRef = useRef();

  const tripTitle =
    bookingData?.pickup_location && bookingData?.dropoff_location
      ? `${bookingData.pickup_location} - ${bookingData.dropoff_location}`
      : bookingData?.trip_title || "";

  const guestText = `${bookingData?.passengers || 0} Adult(s) - ${bookingData?.children || 0} Child(s)`;
  const paymentText =
    bookingData?.payment_method ||
    `Payment on site in cash ${bookingData?.currency || ""} ${bookingData?.total_price || ""}`;
  const nationality =
    bookingData?.nationality || bookingData?.client_nationality || "egyptian";
  const greetingName = bookingData?.client_name || bookingData?.email || "";
  const whatsappLabel = t("common.sendViaWhatsApp") || "Send via WhatsApp";
  const bookingConfirmedText =
    t("common.tripConfirmed") || "Your trip is confirmed!";
  const bookingConfirmationLabel =
    t("common.bookingConfirmationLabel") || "BOOKING CONFIRMATION";
  const thankYouMessage =
    t("print.thankYouMessage") || "Thank you for choosing Expand-Horizon.";
  const bookingRouteMessage =
    t("print.bookingConfirmedMessage") || "Your booking";
  const forRouteConfirmed = t("print.forRouteConfirmed") || "for";
  const isConfirmed = t("print.isConfirmed") || "is confirmed.";
  const needHelpText = t("common.needHelp") || "Need help? Contact us at";
  const orCallText = t("common.orCall") || "or call";

  const handlePrint = () => {
    // window.print();

    //call api print
    const TicketData = {
      BookingNo: bookingData?.BookingNo,
      client_name: bookingData?.client_name,
      pickup_address: bookingData?.pickup_location,
      drop_address: bookingData?.dropoff_location,
      trip_name: bookingData?.vehicle_id == 1 ? "Limousine" : "Shuttle Bus",
      trip_date: bookingData?.trip_date,
      Amount: bookingData?.total_price,
      currency_code: bookingData?.currency,
      is_two_way: bookingData?.is_two_way,
      client_nationality: bookingData?.nationality,
      client_phone: bookingData?.client_phone,
      total_pax: bookingData?.passengers,
      notes: bookingData?.booking_notes,
      lang_code: bookingData?.lang_code,
    };
    dispatch(PrintTicketAPI(TicketData)).then((result) => {
      console.log(result);
    });
  };

  const handleDownload = async () => {
    try {
      const element = ticketRef.current;
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`ticket-${bookingData?.booking_id || "booking"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  /* Temporarily disabled WhatsApp send handler.
    const handleShareWhatsApp = async () => {
        if (!bookingData) return;

        try {
            const element = ticketRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: "#ffffff",
                scale: 2,
            });

            const blob = await new Promise((resolve) => {
                canvas.toBlob(resolve, "image/png");
            });

            if (!blob) {
                throw new Error("Unable to create ticket image.");
            }

            // implementation intentionally removed while disabled
        } catch (error) {
            console.error("Error sharing ticket via WhatsApp:", error);
        }
    };
    */

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      localStorage.getItem("lang") || "en",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  return (
    <Container className="print-ticket-container">
      <div className="ticket-actions">
        <Button
          variant="primary"
          className="action-btn"
          onClick={handlePrint}
          disabled={!bookingData}
        >
          <FiPrinter /> {t("common.print") || "Print"}
        </Button>
        <Button
          variant="outline-primary"
          className="action-btn"
          onClick={handleDownload}
          disabled={!bookingData}
        >
          <FiDownload /> {t("common.download") || "Download"}
        </Button>
        {/* Temporarily disabled WhatsApp send button */}
        {/*
                <Button
                    variant="success"
                    className="action-btn"
                    onClick={handleShareWhatsApp}
                    disabled={!bookingData}
                >
                    <FiSend /> {whatsappLabel}
                </Button>
                */}
      </div>

      <div className="ticket-wrapper" ref={ticketRef}>
        <div className="ticket">
          <div className="ticket-header-row">
            <div className="ticket-logo">
              <img
                src={process.env.PUBLIC_URL + "/images/logo.png"}
                alt="Expand Horizons"
              />
            </div>
            <div className="confirmation-header">
              <span className="confirmation-label">
                {bookingConfirmationLabel}
              </span>
              <h2>{bookingConfirmedText}</h2>
            </div>
          </div>

          <div className="ticket-greeting">
            <p className="greeting-name">
              {t("common.hi") || "Hi"} {greetingName},
            </p>
            <p className="greeting-text">
              {thankYouMessage} {bookingRouteMessage}{" "}
              <strong>{bookingData?.booking_id}</strong> {forRouteConfirmed}{" "}
              <strong>{tripTitle}</strong> {isConfirmed}
            </p>
          </div>

          <div className="ticket-card">
            <div className="ticket-card-row">
              <div className="ticket-card-column">
                <div className="ticket-card-item">
                  <span className="item-label">
                    {t("common.trip") || "Trip"}
                  </span>
                  <span className="item-value">{tripTitle || "-"}</span>
                </div>
                <div className="ticket-card-item">
                  <span className="item-label">
                    {t("common.date") || "Date"}
                  </span>
                  <span className="item-value">
                    {bookingData?.booking_date
                      ? formatDate(bookingData.booking_date)
                      : "-"}
                  </span>
                </div>
                <div className="ticket-card-item">
                  <span className="item-label">
                    {t("common.pickup") || "Pickup"}
                  </span>
                  <span className="item-value">
                    {bookingData?.pickup_location || "-"}
                  </span>
                </div>
                <div className="ticket-card-item is-payment">
                  <span className="item-label">
                    {t("common.payment") || "Payment"}
                  </span>
                  <span className="item-value">{paymentText}</span>
                </div>
              </div>

              <div className="ticket-card-column">
                <div className="ticket-card-item">
                  <span className="item-label">
                    {t("common.bookingRef") || "Booking Ref"}
                  </span>
                  <span className="item-value">
                    {bookingData?.booking_id || "-"}
                  </span>
                </div>
                <div className="ticket-card-item">
                  <span className="item-label">
                    {t("common.guests") || "Guests"}
                  </span>
                  <span className="item-value">{guestText}</span>
                </div>
                <div className="ticket-card-item">
                  <span className="item-label">
                    {t("common.nationality") || "Nationality"}
                  </span>
                  <span className="item-value">{nationality}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="price-summary-card">
            <h3>{t("common.priceSummary") || "Price Summary"}</h3>
            <div className="price-summary-list">
              <div className="price-row">
                <span>{t("common.tripPrice") || "Trip price"}</span>
                <span>
                  {bookingData?.total_price} {bookingData?.currency || "EUR"}
                </span>
              </div>
              <div className="price-row">
                <span>{t("common.discount") || "Discount"}</span>
                <span>{bookingData?.discount || 0}</span>
              </div>
              <div className="price-row total-row">
                <span>{t("common.total") || "Total"}</span>
                <span>
                  {bookingData?.total_price} {bookingData?.currency || "EUR"}
                </span>
              </div>
            </div>
          </div>

          <div className="ticket-footer-row">
            <p>
              {needHelpText}{" "}
              <a href="mailto:info@expand-horizons.de">
                info@expand-horizons.de
              </a>{" "}
              {orCallText} <a href="tel:+21034403755">+2 01034403755</a>.
            </p>
            <div className="social-icons">
              <a
                href="https://www.facebook.com/share/1Wqvi9qwjz/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/expandhorizonredsea"
                target="_blank"
                rel="noreferrer"
              >
                <FaInstagram />
              </a>
              <a href="mailto:info@expand-horizons.com">
                <FaEnvelope />
              </a>
              <a
                href="https://wa.me/201034403755"
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
              </a>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PrintTicket;
