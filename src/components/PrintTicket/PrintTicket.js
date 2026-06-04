import React, { useRef } from "react";
import { Button, Container } from "react-bootstrap";
import { FiPrinter, FiDownload } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./PrintTicket.scss";

const PrintTicket = ({ bookingData }) => {
    const { t } = useTranslation();
    const ticketRef = useRef();

    const handlePrint = () => {
        window.print();
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
            </div>

            <div className="ticket-wrapper" ref={ticketRef}>
                <div className="ticket">
                    {/* Header with Logo */}
                    <div className="ticket-header">
                        <div className="ticket-logo">
                            <img
                                src={process.env.PUBLIC_URL + '/images/logo.png'}
                                alt="Expand Horizons"
                            />
                        </div>
                        <div className="ticket-title">
                            <h1>EXPAND HORIZONS</h1>
                            <p>{t("common.bookingTicket") || "Booking Ticket"}</p>
                        </div>
                    </div>

                    <hr className="ticket-divider" />

                    {/* Booking Information */}
                    <div className="ticket-section">
                        <h3 className="section-title">
                            {t("common.bookingDetails") || "Booking Details"}
                        </h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="detail-label">
                                    {t("common.bookingId") || "Booking ID"}:
                                </span>
                                <span className="detail-value">{bookingData?.booking_id}</span>
                            </div>
                            <div className="detail-item status-item">
                                <span className="detail-label">
                                    {t("common.status") || "Status"}:
                                </span>
                                <span className="detail-value status-confirmed">
                                    {t("common.confirmed") || "Confirmed"}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">
                                    {t("common.date") || "Date"}:
                                </span>
                                <span className="detail-value">
                                    {bookingData?.booking_date
                                        ? formatDate(bookingData.booking_date)
                                        : new Date().toLocaleDateString()}
                                </span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">
                                    {t("common.email") || "Email"}:
                                </span>
                                <span className="detail-value">{bookingData?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trip/Service Details */}
                    {bookingData?.trip_type && (
                        <div className="ticket-section">
                            <h3 className="section-title">
                                {t("common.serviceDetails") || "Service Details"}
                            </h3>
                            <div className="detail-grid">
                                <div className="detail-item full-width service-type-item">
                                    <span className="detail-label">
                                        {t("common.serviceType") || "Service Type"}:
                                    </span>
                                    <span className="detail-value">
                                        {bookingData?.trip_type === 1
                                            ? t("common.tour") || "Tour"
                                            : bookingData?.trip_type === 2
                                                ? t("common.transfer") || "Transfer"
                                                : t("common.excursion") || "Excursion"}
                                    </span>
                                </div>
                            </div>

                            {bookingData?.pickup_location && (
                                <div className="location-details">
                                    <div className="location-item">
                                        <span className="location-label">
                                            {t("common.pickupLocation") || "Pickup Location"}:
                                        </span>
                                        <span className="location-value">
                                            {bookingData.pickup_location}
                                        </span>
                                    </div>
                                    {bookingData?.dropoff_location && (
                                        <div className="location-item">
                                            <span className="location-label">
                                                {t("common.dropoffLocation") || "Dropoff Location"}:
                                            </span>
                                            <span className="location-value">
                                                {bookingData.dropoff_location}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Passenger Information */}
                    {bookingData?.passengers && (
                        <div className="ticket-section">
                            <h3 className="section-title">
                                {t("common.passengerInfo") || "Passenger Information"}
                            </h3>
                            <div className="passenger-details">
                                <span className="detail-label">
                                    {t("common.numberOfPassengers") || "Number of Passengers"}:
                                </span>
                                <span className="detail-value">{bookingData.passengers}</span>
                            </div>
                        </div>
                    )}

                    {/* Price Information */}
                    {bookingData?.total_price && (
                        <div className="ticket-section price-section">
                            <h3 className="section-title">
                                {t("common.priceDetails") || "Price Details"}
                            </h3>
                            <div className="price-details">
                                <div className="price-item">
                                    <span className="price-label">
                                        {t("common.totalPrice") || "Total Price"}:
                                    </span>
                                    <span className="price-value">
                                        {bookingData.total_price} {bookingData?.currency || "SAR"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <hr className="ticket-divider" />

                    {/* Footer */}
                    <div className="ticket-footer">
                        <p className="footer-text">
                            {t("common.bookingConfirmation") ||
                                "Thank you for your booking with Expand Horizons"}
                        </p>
                        <p className="footer-note">
                            {t("common.ticketNotice") ||
                                "Please present this ticket at the time of service"}
                        </p>
                        <p className="footer-contact">
                            {t("common.contactUs") || "Contact us"}: support@expandhorizons.com
                        </p>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default PrintTicket;
