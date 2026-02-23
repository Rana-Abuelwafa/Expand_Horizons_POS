import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaRegCalendarCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next";


const BookingModal = () => {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    navigate("/"); // <-- redirect to home
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      className="booking-modal"
      backdrop="static"
    >
      <Modal.Body className="text-center">
        <FaRegCalendarCheck className="booking-icon" />
        <p className="booking-message">
         {t("bookings.confirmation.title")}
        </p>
        <p className="booking-subtext">
           {t("bookings.confirmation.subtitle")}
        </p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" className="okBtn" onClick={handleClose}>
          OK
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingModal;
