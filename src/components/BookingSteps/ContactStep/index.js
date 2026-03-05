import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { checkAvailability } from "../../../redux/Slices/bookingSlice";
import { confirmBooking } from "../../../redux/Slices/confirmSlice";
import PopUp from "../../Shared/popup/PopUp";
import LoadingPage from "../../Loader/LoadingPage";
import {
  getBookingSummary,
  clearRefresh,
} from "../../../redux/Slices/bookingSummarySlice";
const ContactStep = ({ availabilityData, childAges }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // const { profileData, loading: profileLoading } = useSelector(
  //   (state) => state.profile,
  // );
  // const currentLang = useSelector((state) => state.language.currentLang) || "en";
  const currentLang = localStorage.getItem("lang") || "de";
  const { summaryData, shouldRefresh } = useSelector(
    (state) => state.bookingSummary,
  );
  const { loading: bookingLoading, error: bookingError } = useSelector(
    (state) => state.booking,
  );
  const { loading: extrasLoading, error: extrasError } = useSelector(
    (state) => state.extras,
  );
  const {
    loading: confirmLoading,
    error: confirmError,
    success: confirmSuccess,
    confirmed,
  } = useSelector((state) => state.confirmBooking);

  // const fullName = user?.firstName + " " + user?.lastName;
  // const userEmail = user?.email;
  // const userPhone = user?.phoneNumber;

  const [contactInfo, setContactInfo] = useState({
    // fullName: fullName || "",
    // email: userEmail || "",
    // phone: userPhone || "",
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
  });
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupType, setPopupType] = useState("alert");

  // Fetch profile data on component mount
  // useEffect(() => {
  //   dispatch(fetchProfile()).unwrap();
  // }, [dispatch]);

  // Update nationality when profile data is loaded
  // useEffect(() => {
  //   if (profileData?.nation) {
  //     setContactInfo((prev) => ({
  //       ...prev,
  //       nationality: profileData.nation,
  //     }));
  //   }
  // }, [profileData]);
  useEffect(() => {
    fetchBookingSummary();
  }, [dispatch, availabilityData]);

  useEffect(() => {
    if (shouldRefresh) {
      fetchBookingSummary();
      dispatch(clearRefresh()); // Clear the refresh flag after fetching
    }
  }, [shouldRefresh, dispatch]);

  const fetchBookingSummary = () => {
    var bookingId = availabilityData?.idOut;
    console.log("bookingId", bookingId);
    const user = JSON.parse(localStorage.getItem("user"));
    const clientId = user?.id;
    if (bookingId) {
      dispatch(
        getBookingSummary({
          booking_id: bookingId,
          client_id: clientId,
          lang_code: currentLang,
        }),
      );
    }
  };
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const bookingId = availabilityData?.idOut;

      if (!bookingId) {
        // setPopupMessage(t('bookings.noBookingId'));
        // setPopupType('alert');
        // setShowPopup(true);
        return;
      }

      const clientId = user?.id;

      // Prepare booking data with contact information
      const bookingData = {
        id: bookingId,
        trip_id: summaryData?.trip_id,
        client_id: summaryData?.client_id,
        client_email: contactInfo.email,
        client_phone: contactInfo.phone,
        client_nationality: contactInfo.nationality,
        booking_notes: notes,
        client_name: contactInfo.fullName,
        total_pax: summaryData?.total_pax || 1,
        child_num: summaryData?.child_num || 0,
        infant_num: summaryData?.infant_num || 0,
        trip_code: summaryData?.trip_code_auto,
        trip_type: summaryData?.trip_type,
        booking_dateStr: summaryData?.booking_datestr || "",
        trip_dateStr: summaryData?.trip_datestr || "",
        currency_code: summaryData?.currency_code,
        pickup_address: summaryData?.pickup_address || "",
        booking_status: 1,
        total_price: summaryData?.total_price,
        is_two_way: summaryData?.is_two_way,
        trip_return_date: null,
        trip_return_dateStr: summaryData?.trip_return_dateStr,
        child_ages: summaryData?.child_ages,
        pricing_type: summaryData?.pricing_type,
        childAgesArr: childAges,
      };

      const availabilityResult = await dispatch(
        checkAvailability(bookingData),
      ).unwrap();

      // Now confirm the booking
      const confirmData = {
        booking_id: bookingId,
        client_id: clientId,
        lang_code: currentLang,
        ClientEmail: contactInfo.email,
      };

      const result = await dispatch(confirmBooking(confirmData)).unwrap();

      if (result === true) {
        navigate("/bookingConfirmation");
      }
      // else {
      //     setPopupMessage(t('bookings.contact.bookingConfirmationFailed'));
      //     setPopupType('alert');
      //     setShowPopup(true);
      // }
    } catch (error) {
      setPopupMessage(error.message);
      setPopupType("alert");
      setShowPopup(true);
    }
  };

  // Show error popup if there's a confirmation error
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
            {/* {t('bookings.contact.nextButton')} */}
          </button>
        </Form>
      </div>

      {/* Popup for errors */}
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
