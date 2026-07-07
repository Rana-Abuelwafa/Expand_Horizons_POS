import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { checkAvailability } from "../../../redux/Slices/bookingSlice";
import { confirmBooking } from "../../../redux/Slices/confirmSlice";
import PopUp from "../../Shared/popup/PopUp";
import DatePicker from "react-datepicker";
import LoadingPage from "../../Loader/LoadingPage";
import {
  FaCalendarAlt,
  FaChevronDown,
} from "react-icons/fa";

const ContactStep = ({ childAges, MapData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const currentLang = localStorage.getItem("lang") || "de";
  const { loading: bookingLoading } = useSelector((state) => state.booking);
  const {
    loading: confirmLoading,
    error: confirmError,
  } = useSelector((state) => state.confirmBooking);

  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
  });
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [totalPax, setTotalPax] = useState(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");

  // Updates contact form fields while preserving other values.
  const handleInputChange = (field, value) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotesChange = (value) => {
    setNotes(value);
  };

  const handlePhoneChange = (value) => {
    setContactInfo((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  // Validates required contact, pax, and datetime fields before API calls.
  const validateForm = () => {
    const newErrors = {};

    if (!contactInfo.fullName?.trim()) {
      newErrors.fullName = t("bookings.contact.errors.required");
    }

    if (!contactInfo.email?.trim()) {
      newErrors.email = t("bookings.contact.errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactInfo.email)) {
      newErrors.email = t("bookings.contact.errors.invalidEmail");
    }

    if (!contactInfo.phone) {
      newErrors.phone = t("bookings.contact.errors.required");
    }

    if (!contactInfo.nationality?.trim()) {
      newErrors.nationality = t("bookings.contact.errors.required");
    }
    if (!totalPax?.trim()) {
      newErrors.totalPax = t("bookings.contact.errors.required");
    }
    if (!selectedDateTime) {
      newErrors.selectedDateTime = t("bookings.contact.errors.required");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);

  minDate.setHours(0, 0, 0, 0);

  const filterDate = (date) => {
    return date >= minDate;
  };

  // Converts Date object to API datetime string.
  const formatDateTimeForAPI = (dateTime) => {
    if (!dateTime) return "";

    const year = dateTime.getFullYear();
    const month = (dateTime.getMonth() + 1).toString().padStart(2, "0");
    const day = dateTime.getDate().toString().padStart(2, "0");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");
    const seconds = dateTime.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <Button
      variant="light"
      className="booking-selection__button w-100"
      onClick={onClick}
      ref={ref}
    >
      <div className="d-flex align-items-center">
        <FaCalendarAlt className="booking-selection__icon me-2" />
        {value || t("booking.date.selectDateTime")}
      </div>
      <FaChevronDown className="booking-selection__chevron" />
    </Button>
  ));

  // Creates booking, confirms it, then prepares data for confirmation screen.
  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const bookingId = 0;

      const clientId = user?.id;
      const formattedDateTime = formatDateTimeForAPI(selectedDateTime);
      const bookingData = {
        id: bookingId,
        trip_id: 0,
        client_id: clientId,
        client_email: contactInfo.email,
        client_phone: contactInfo.phone,
        client_nationality: contactInfo.nationality,
        booking_notes: notes,
        client_name: contactInfo.fullName,
        total_pax: totalPax,
        child_num: 0,
        infant_num: 0,
        trip_code: "POS_Trans",
        trip_type: 2,
        booking_dateStr: formattedDateTime,
        trip_dateStr: formattedDateTime,
        currency_code: "EUR",
        pickup_address: MapData?.pickup_address,
        booking_status: 2,
        total_price: MapData?.totalPrice,
        is_two_way: MapData.isTwoWay,
        trip_return_dateStr: null,
        child_ages: "",
        pricing_type: 0,
        childAgesArr: childAges,
        pickup_lat: MapData?.pickup_lat,
        pickup_long: MapData?.pickup_long,
        drop_address: MapData?.drop_address,
        drop_lat: MapData?.drop_lat,
        drop_long: MapData?.drop_long,
        route_distance: MapData?.distance,
        route_price: MapData?.totalPrice,
        trip_name: localStorage.getItem("horizon_pos_vehicle_name"),
        vehicle_id: localStorage.getItem("horizon_pos_vehicle_id"),
      };

      const availabilityResult = await dispatch(
        checkAvailability(bookingData),
      ).unwrap();

      console.log("availabilityResult ", availabilityResult);
      if (availabilityResult != null && availabilityResult.success) {
        const confirmData = {
          booking_id: availabilityResult?.idOut,
          client_id: clientId,
          lang_code: currentLang,
          ClientEmail: contactInfo.email,
        };
        const result = await dispatch(confirmBooking(confirmData)).unwrap();
        console.log("result ", result);

        const bookingDisplayData = {
          BookingNo: availabilityResult?.refOut,
          booking_id: availabilityResult?.idOut,
          email: contactInfo.email,
          booking_date: selectedDateTime
            ? selectedDateTime.toISOString()
            : new Date().toISOString(),
          trip_date: selectedDateTime
            ? selectedDateTime.toISOString()
            : new Date().toISOString(),
          trip_type: 2,
          pickup_location: MapData?.pickup_address,
          dropoff_location: MapData?.drop_address,
          passengers: totalPax,
          total_price: MapData?.totalPrice,
          currency: "EUR",
          client_phone: contactInfo.phone,
          client_name: contactInfo.fullName,
          nationality: contactInfo.nationality,
          is_two_way: MapData.isTwoWay,
          payment_method: `Payment on site in cash EUR ${MapData?.totalPrice}`,
          booking_notes: notes,
          vehicle_id: localStorage.getItem("horizon_pos_vehicle_id"),
          trip_name: localStorage.getItem("horizon_pos_vehicle_name"),
          lang_code: currentLang,
        };

        localStorage.setItem(
          "lastBookingData",
          JSON.stringify(bookingDisplayData),
        );

        navigate("/bookingConfirmation", {
          state: { bookingData: bookingDisplayData },
        });
      }
    } catch (error) {
      setPopupMessage("Error , Please Contact Admin");
      setPopupType("alert");
      setShowPopup(true);
    }
  };

  useEffect(() => {
    if (confirmError) {
      setPopupMessage(
        confirmError || t("bookings.contact.bookingConfirmationFailed"),
      );
      setPopupType("alert");
      setShowPopup(true);
    }
  }, [confirmError, t]);

  const isLoading = bookingLoading || confirmLoading;

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <>
      <div className="contact-step">
        <h2 className="contact-title">{t("bookings.contact.title")}</h2>

        <div className="required-fields-notice">
          {t("bookings.contact.requiredFields")}
        </div>

        <Form className="contact-details">
          <Form.Group className="form-group">
            <Form.Control
              type="text"
              value={contactInfo.fullName || ""}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder={t("bookings.contact.fullNamePlaceholder")}
              className={`form-input ${errors.fullName ? "is-invalid" : ""}`}
            />
            {errors.fullName && (
              <div className="error-message">{errors.fullName}</div>
            )}
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Control
              type="email"
              value={contactInfo.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={t("bookings.contact.emailPlaceholder")}
              className={`form-input ${errors.email ? "is-invalid" : ""}`}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </Form.Group>

          <Form.Group className="form-group">
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="EG"
              value={contactInfo.phone}
              onChange={handlePhoneChange}
              placeholder={t("bookings.contact.phonePlaceholder")}
              className={`phone-input ${errors.phone ? "is-invalid" : ""}`}
            />
            {errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Control
              type="text"
              value={contactInfo.nationality || ""}
              onChange={(e) => handleInputChange("nationality", e.target.value)}
              placeholder={t("bookings.contact.nationalityPlaceholder")}
              className={`form-input ${errors.nationality ? "is-invalid" : ""}`}
            />
            {errors.nationality && (
              <div className="error-message">{errors.nationality}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <DatePicker
              selected={selectedDateTime}
              onChange={(date) => setSelectedDateTime(date)}
              customInput={<CustomInput />}
              minDate={minDate}
              filterDate={filterDate}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              timeCaption={t("booking.date.time")}
              dateFormat="EEE, MMM d, yyyy HH:mm"
              showPopperArrow={false}
              popperClassName="custom-datepicker-popper"
              inline={false}
              shouldCloseOnSelect={true}
            />
            {errors.selectedDateTime && (
              <div className="error-message">{errors.selectedDateTime}</div>
            )}
          </Form.Group>

          <Form.Group className="form-group">
            

            <Form.Control
              type="number"
              min={1}
              max={20}
              value={totalPax}
              onChange={(e) => setTotalPax(e.target.value)}
              placeholder={t("booking.TotalPax")}
              className={`form-input ${errors.totalPax ? "is-invalid" : ""}`}
            />
            {errors.totalPax && (
              <div className="error-message">{errors.totalPax}</div>
            )}
          </Form.Group>
          <Form.Group className="form-group">
            <Form.Control
              as="textarea"
              rows={5}
              value={notes || ""}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder={t("bookings.contact.notesPlaceholder")}
              className="form-input"
              style={{ height: "100px" }}
            />
          </Form.Group>

          <div className="disclaimer text-center">
            {t("bookings.contact.disclaimer")}
          </div>

          <button
            type="button"
            className="payment-btn"
            onClick={handleNext}
            disabled={isLoading}
          >
            {t("bookings.contact.confirmButton")}
            
          </button>
        </Form>
      </div>

      
      {showPopup && (
        <PopUp
          show={showPopup}
          closeAlert={() => {
            setShowPopup(false);
          }}
          msg={popupMessage}
          type={popupType}
          showConfirmButton={true}
        />
      )}
    </>
  );
};

export default ContactStep;
