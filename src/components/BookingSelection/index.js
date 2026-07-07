import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Dropdown, Form } from 'react-bootstrap';
import { FaCalendarAlt, FaUsers, FaMinus, FaPlus, FaChevronDown, FaExchangeAlt } from 'react-icons/fa';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from 'react-redux';
import { checkAvailability, resetBookingOperation } from '../../redux/Slices/bookingSlice';
import { calculateBookingPrice, resetCalculation } from '../../redux/Slices/priceCalculationSlice';
import PopUp from '../Shared/popup/PopUp';
import LoadingPage from '../Loader/LoadingPage';

const BookingSelection = ({ tripData }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.accessToken;
    const maxAge = tripData?.max_child_age || 0;
    const hasChildOption = tripData?.max_child_age !== null;
    const isTwoWayTransferType = tripData?.trip_type === 2;

    const { loading, error, success, availabilityData } = useSelector((state) => state.booking);
    const { loading: calculationLoading, error: calculationError, success: calculationSuccess, calculationData } = useSelector((state) => state.priceCalculation);

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [popupType, setPopupType] = useState('alert');
    const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

    const [participants, setParticipants] = useState({
        adults: 1,
        children: 0
    });
    const [childAges, setChildAges] = useState([]);
    const [selectedDateTime, setSelectedDateTime] = useState(null);
    const [selectedReturnDateTime, setSelectedReturnDateTime] = useState(null);
    const [isTwoWay, setIsTwoWay] = useState(false); // Checkbox state for two-way transfer
    const [showParticipants, setShowParticipants] = useState(false);
    const [ageValidationErrors, setAgeValidationErrors] = useState([]);

    // Enforces release-days booking rule from API configuration.
    const minDate = new Date();
    if (tripData?.release_days) {
        minDate.setDate(minDate.getDate() + parseInt(tripData.release_days));
    }
    minDate.setHours(0, 0, 0, 0);

    const totalParticipants = participants.adults + participants.children;

    const exceedsMaxCapacity = tripData?.trip_max_capacity && totalParticipants > parseInt(tripData.trip_max_capacity);

    useEffect(() => {
        dispatch(resetBookingOperation());
        dispatch(resetCalculation());
    }, [dispatch]);

    useEffect(() => {
        if (participants.children > childAges.length) {
            const newAges = [...childAges];
            while (newAges.length < participants.children) {
                newAges.push('');
            }
            setChildAges(newAges);
        } else if (participants.children < childAges.length) {
            setChildAges(childAges.slice(0, participants.children));
        }
    }, [participants.children]);

    useEffect(() => {
        if (showPriceBreakdown) {
            setShowPriceBreakdown(false);
            dispatch(resetCalculation());
        }
    }, [participants, selectedDateTime, isTwoWay, childAges]);

    useEffect(() => {
        if (error) {
            setPopupMessage(error || t("booking.availabilityError"));
            setPopupType('alert');
            setShowPopup(true);
            dispatch(resetBookingOperation());
        } else if (calculationError) {
            setPopupMessage(calculationError || t("booking.priceCalculationError"));
            setPopupType('alert');
            setShowPopup(true);
            dispatch(resetCalculation());
        } else if (calculationSuccess && calculationData) {
            setShowPriceBreakdown(true);
        }
    }, [error, calculationError, calculationSuccess, calculationData, t, dispatch]);

    const handleParticipantChange = (type, action) => {
        const newValue = action === 'increment'
            ? participants[type] + 1
            : Math.max(type === 'adults' ? 1 : 0, participants[type] - 1);

        const newTotal = totalParticipants - participants[type] + newValue;

        if (tripData?.trip_max_capacity && newTotal > parseInt(tripData.trip_max_capacity)) {
            setPopupMessage(t('booking.maxCapacityExceeded', { maxCapacity: tripData.trip_max_capacity }));
            setPopupType('alert');
            setShowPopup(true);
            return;
        }

        setParticipants(prev => ({
            ...prev,
            [type]: newValue
        }));
    };

    const handleAgeChange = (index, value) => {
        const newAges = [...childAges];
        newAges[index] = value;
        setChildAges(newAges);

        const newErrors = [...ageValidationErrors];
        newErrors[index] = false;
        setAgeValidationErrors(newErrors);
    };

    // Validates dynamic child age fields against configured max age.
    const validateChildAges = () => {
        if (!hasChildOption) return true;

        const errors = [];
        let hasError = false;

        childAges.forEach((age, index) => {
            const ageNum = parseInt(age);
            const maxChildAge = tripData?.max_child_age ? parseInt(tripData.max_child_age) : 12;

            if (!age || isNaN(ageNum) || ageNum < 0 || ageNum > maxChildAge) {
                errors[index] = true;
                hasError = true;
            } else {
                errors[index] = false;
            }
        });

        setAgeValidationErrors(errors);
        return !hasError;
    };

    const getParticipantText = () => {
        const { adults, children } = participants;

        if (adults === 1 && children === 0) {
            return t('booking.participants.adultSingle');
        }

        if (adults > 1 && children === 0) {
            return t('booking.participants.adults', { count: adults });
        }

        if (adults === 0 && children > 0) {
            return t('booking.participants.children', { count: children });
        }

        return t('booking.participants.mixed', { adults, children });
    };

    const getDateTimeText = () => {
        if (!selectedDateTime) {
            return t('booking.date.selectDateTime');
        }
        
        return selectedDateTime.toLocaleString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                {value || t('booking.date.selectDateTime')}
            </div>
            <FaChevronDown className="booking-selection__chevron" />
        </Button>
    ));

    const validateInputs = () => {
        if (!selectedDateTime) {
            setPopupMessage(t('booking.dateTimeRequired'));
            setPopupType('alert');
            setShowPopup(true);
            return false;
        }

        if (selectedDateTime < minDate) {
            setPopupMessage(t('booking.invalidDateTime', { releaseDays: tripData?.release_days || 0 }));
            setPopupType('alert');
            setShowPopup(true);
            return false;
        }

        if (isTwoWayTransferType && isTwoWay && !selectedReturnDateTime) {
            setPopupMessage(t('booking.returnDateTimeRequired'));
            setPopupType('alert');
            setShowPopup(true);
            return false;
        }

        if (isTwoWayTransferType && isTwoWay && selectedReturnDateTime && selectedReturnDateTime <= selectedDateTime) {
            setPopupMessage(t('booking.returnDateAfterDeparture'));
            setPopupType('alert');
            setShowPopup(true);
            return false;
        }
        if (exceedsMaxCapacity) {
            setPopupMessage(t('booking.maxCapacityExceeded', { maxCapacity: tripData.trip_max_capacity }));
            setPopupType('alert');
            setShowPopup(true);
            return false;
        }

        if (hasChildOption && participants.children > 0 && !validateChildAges()) {
            setPopupMessage(t('booking.invalidChildAges', { maxAge: tripData?.max_child_age || 12 }));
            setPopupType('alert');
            setShowPopup(true);
            return false;
        }

        return true;
    };

    // Converts Date object into backend datetime format.
    const formatDateTimeForAPI = (dateTime) => {
        if (!dateTime) return '';
        
        const year = dateTime.getFullYear();
        const month = (dateTime.getMonth() + 1).toString().padStart(2, '0');
        const day = dateTime.getDate().toString().padStart(2, '0');
        const hours = dateTime.getHours().toString().padStart(2, '0');
        const minutes = dateTime.getMinutes().toString().padStart(2, '0');
        const seconds = dateTime.getSeconds().toString().padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const handleCheckAvailability = async () => {
        if (!validateInputs()) return;

        try {
            // Price calculation is separated from booking creation for UX preview.
            const numericChildAges = hasChildOption ? childAges.map(age => parseInt(age)) : [];

            const calculationData = {
                booking_id: 0,
                trip_id: tripData?.trip_id,
                adult_num: participants.adults,
                child_num: hasChildOption ? participants.children : 0,
                currency_code: "EUR",
                extra_lst: [],
                extra_obligatory:[],
                childAges: numericChildAges,
                is_two_way: isTwoWayTransferType ? isTwoWay : false
            };

            await dispatch(calculateBookingPrice(calculationData)).unwrap();

        } catch (err) {
        }
    };

    const handleContinueBooking = async () => {
        if (!validateInputs()) return;

       const formattedDateTime = formatDateTimeForAPI(selectedDateTime);
       const formattedReturnDateTime = isTwoWayTransferType && isTwoWay ? formatDateTimeForAPI(selectedReturnDateTime) : null;

        const user = JSON.parse(localStorage.getItem("user"));
        const clientId = user?.id;
        const clientEmail = user?.email || "";
       
        const numericChildAges = hasChildOption ? childAges.map(age => parseInt(age)) : [];

        const bookingData = {
            id: 0,
            trip_id: tripData?.trip_id,
            client_id: clientId,
            client_email: "",
            client_name: "",
            total_pax: participants.adults,
            booking_code: "",
            booking_date: null,
            child_num: hasChildOption ? participants.children : 0,
            total_price: 0,
            pickup_time: "",
            booking_status: 1,
            trip_date: null,
            trip_return_date: null,
            booking_notes: "",
            trip_code: tripData?.trip_code_auto,
            infant_num: 0,
            pickup_address: "",
            client_phone: "",
            booking_code_auto: "",
            client_nationality: "",
            gift_code: "",
            trip_type: tripData?.trip_type,
            booking_dateStr: "",
            trip_dateStr: formattedDateTime,
            trip_return_dateStr: formattedReturnDateTime,
            currency_code: "EUR",
            is_two_way: isTwoWayTransferType ? isTwoWay : false,
            child_ages: tripData?.child_ages? tripData?.child_ages:null,
            pricing_type: tripData?.pricing_type_id,
            childAgesArr: numericChildAges
        };

        try {
            // Save booking first, then navigate to checkout with API response data.
            const result = await dispatch(checkAvailability(bookingData)).unwrap();

            navigate("/checkout", {
                state: {
                    availabilityData: result, // Use the result from checkAvailability
                    trip: tripData,
                    childAges: numericChildAges
                }
            });

        } catch (err) {
        }
    };

    const ParticipantsToggle = React.forwardRef(({ children, onClick }, ref) => (
        <Button
            ref={ref}
            variant="light"
            className="booking-selection__button w-100"
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            <div className="d-flex align-items-center">
                <FaUsers className="booking-selection__icon me-2" />
                {children}
            </div>
            <FaChevronDown className={`booking-selection__chevron ${showParticipants ? 'booking-selection__chevron--open' : ''}`} />
        </Button>
    ));

     const ReturnDateCustomInput = React.forwardRef(({ value, onClick }, ref) => (
            <Button
                variant="light"
                className="booking-selection__button w-100"
                onClick={onClick}
                ref={ref}
            >
                <div className="d-flex align-items-center">
                    <FaExchangeAlt className="booking-selection__icon me-2" />
                    {value || t('booking.date.selectReturnDateTime')}
                </div>
                <FaChevronDown className="booking-selection__chevron" />
            </Button>
        ));

    const filterDate = (date) => {
        return date >= minDate;
    };

    if (loading && token) {
         return <LoadingPage />;
    }

    if (calculationLoading) {
         return <LoadingPage />;
    }
    
    return (
        <>
            <div className="booking-selection">
                <Container>
                    <div className="booking-selection-content">
                        <h3 className="booking-selection__title">
                            {t('booking.title')}
                        </h3>

                        <Row className="g-3 mb-4">
                            
                            <Col lg={12} md={12} sm={12}>
                                <Dropdown
                                    show={showParticipants}
                                    onToggle={(isOpen) => setShowParticipants(isOpen)}
                                >
                                    <Dropdown.Toggle as={ParticipantsToggle}>
                                        {getParticipantText()}
                                        {exceedsMaxCapacity ? " ⚠️" : null}
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="booking-selection__dropdown w-100">
                                        
                                        {exceedsMaxCapacity ? (
                                            <div className="text-danger small p-2">
                                                {t('booking.maxCapacityExceeded', { maxCapacity: tripData.trip_max_capacity })}
                                            </div>
                                        ) : null}

                                        
                                        <div className="booking-selection__counter">
                                            <div className="booking-selection__counter-info">
                                                <div className="booking-selection__counter-title">{t('booking.participants.adult')}</div>
                                                <div className="booking-selection__counter-subtitle">({t('booking.participants.ageRangeAdults')})</div>
                                            </div>
                                            <div className="booking-selection__counter-controls">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('adults', 'decrement')}
                                                    disabled={participants.adults <= 1}
                                                >
                                                    <FaMinus />
                                                </Button>
                                                <span className="booking-selection__counter-value">
                                                    {participants.adults}
                                                </span>
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    className="booking-selection__counter-btn"
                                                    onClick={() => handleParticipantChange('adults', 'increment')}
                                                    disabled={exceedsMaxCapacity}
                                                >
                                                    <FaPlus />
                                                </Button>
                                            </div>
                                        </div>

                                        
                                        {hasChildOption && (
                                            <>
                                                <hr className="my-3" />

                                                <div className="booking-selection__counter">
                                                    <div className="booking-selection__counter-info">
                                                        <div className="booking-selection__counter-title">{t('booking.participants.child')}</div>
                                                        <div className="booking-selection__counter-subtitle">
                                                            ({t('booking.participants.ageRangeChildren', { maxAge: maxAge })})
                                                        </div>
                                                    </div>
                                                    <div className="booking-selection__counter-controls">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="booking-selection__counter-btn"
                                                            onClick={() => handleParticipantChange('children', 'decrement')}
                                                            disabled={participants.children <= 0}
                                                        >
                                                            <FaMinus />
                                                        </Button>
                                                        <span className="booking-selection__counter-value">
                                                            {participants.children}
                                                        </span>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="booking-selection__counter-btn"
                                                            onClick={() => handleParticipantChange('children', 'increment')}
                                                            disabled={exceedsMaxCapacity}
                                                        >
                                                            <FaPlus />
                                                        </Button>
                                                    </div>
                                                </div>

                                                
                                                {participants.children > 0 && (
                                                    <>
                                                        <hr className="my-3" />
                                                        <div className="booking-selection__age-inputs">
                                                            <div className="booking-selection__counter-title mb-2">
                                                                {t('booking.participants.enterChildAges')}
                                                            </div>
                                                            {childAges.map((age, index) => (
                                                                <div key={index} className="booking-selection__age-input-group mb-2">
                                                                    <Form.Label className="small mb-1">
                                                                        {t('booking.participants.childAge', { number: index + 1 })}
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        type="number"
                                                                        min="0"
                                                                        max={maxAge}
                                                                        value={age}
                                                                        onChange={(e) => handleAgeChange(index, e.target.value)}
                                                                        onInput={(e) => {
                                                                            let value = e.target.value;

                                                                            if (value && parseInt(value) > maxAge) {
                                                                                e.target.value = maxAge;
                                                                                handleAgeChange(index, maxAge.toString());
                                                                            }
                                                                        }}
                                                                        className={`booking-selection__age-input ${ageValidationErrors[index] ? 'is-invalid' : ''}`}
                                                                        placeholder="0"
                                                                    />
                                                                    {ageValidationErrors[index] && (
                                                                        <div className="invalid-feedback d-block">
                                                                            {t('booking.participants.invalidAge', { maxAge: tripData?.max_child_age || 12 })}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </>
                                                )}
                                            </>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>

                            
                            <Col lg={12} md={12} sm={12}>
                                <DatePicker
                                    selected={selectedDateTime}
                                    onChange={(date) => setSelectedDateTime(date)}
                                    customInput={<CustomInput />}
                                    minDate={minDate}
                                    filterDate={filterDate}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={30}
                                    timeCaption={t('booking.date.time')}
                                    dateFormat="EEE, MMM d, yyyy HH:mm"
                                    showPopperArrow={false}
                                    popperClassName="custom-datepicker-popper"
                                    inline={false}
                                    shouldCloseOnSelect={true}
                                />
                            </Col>

                            
                            {isTwoWayTransferType && (
                                <Col lg={6} md={6} sm={6}>
                                    <Form.Check
                                        type="checkbox"
                                        id="two-way-transfer"
                                        label={t('booking.twoWayTransfer')}
                                        checked={isTwoWay}
                                         onChange={(e) => {
                                            setIsTwoWay(e.target.checked);
                                            if (!e.target.checked) {
                                                setSelectedReturnDateTime(null); // Reset return date when unchecked
                                            }
                                        }}
                                        className="booking-selection__checkbox"
                                    />
                                </Col>
                            )}

                             
                                                        {isTwoWayTransferType && isTwoWay && (
                                                            
                                                                        <Col lg={12} md={12} sm={12}>
                                                                            <DatePicker
                                                                                selected={selectedReturnDateTime}
                                                                                onChange={(date) => setSelectedReturnDateTime(date)}
                                                                                customInput={<ReturnDateCustomInput />}
                                                                                minDate={selectedDateTime ? new Date(selectedDateTime.getTime() + 60 * 60 * 1000) : minDate} // At least 1 hour after departure
                                                                                filterDate={filterDate}
                                                                                showTimeSelect
                                                                                timeFormat="HH:mm"
                                                                                timeIntervals={30}
                                                                                timeCaption={t('booking.date.time')}
                                                                                dateFormat="EEE, MMM d, yyyy HH:mm"
                                                                                showPopperArrow={false}
                                                                                popperClassName="custom-datepicker-popper"
                                                                                inline={false}
                                                                                shouldCloseOnSelect={true}
                                                                                popperPlacement="top-start"
                                                                            />
                                                                        </Col>
                                                                  
                                                        )}
                                                

                            
                            
                        </Row>

                        
                        {showPriceBreakdown && calculationData && (
                            <Row className="mb-4">
                                <Col>
                                    <div className="booking-selection__price-breakdown">
                                        <div className="booking-selection__price-total text-center mb-3">
                                            <div className="booking-selection__final-price">
                                                {calculationData.final_price} €
                                            </div>
                                            <div className="booking-selection__price-note small text-muted">
                                                {t('booking.allTaxesIncluded')}
                                            </div>
                                        </div>

                                        <div className="booking-selection__price-details">
                                            {participants.adults > 0 && calculationData.total_adult_price > 0 && (
                                                <div className="booking-selection__price-line d-flex justify-content-between">
                                                    <span>
                                                        {participants.adults} {t('booking.participants.adult')}
                                                        
                                                    </span>
                                                    <span>{calculationData.total_adult_price} €</span>
                                                </div>
                                            )}

                                            {participants.children > 0 && calculationData.total_child_price > 0 && (
                                                <div className="booking-selection__price-line d-flex justify-content-between">
                                                    <span>
                                                        {participants.children} {t('booking.participants.child')}
                                                        
                                                    </span>
                                                    <span>{calculationData.total_child_price} €</span>
                                                </div>
                                            )}

                                            
                                            {isTwoWayTransferType && isTwoWay && (
                                                <div className="booking-selection__price-line d-flex justify-content-between">
                                                    <span>{t('booking.twoWayTransfer')}</span>
                                                    <span>{t('booking.included')}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        )}

                        
                        <Row>
                            <Col>
                                <Button
                                    className="booking-selection__check-btn w-100"
                                    onClick={showPriceBreakdown ? handleContinueBooking : handleCheckAvailability}
                                    disabled={loading || exceedsMaxCapacity || !selectedDateTime}
                                >
                                    {showPriceBreakdown ? t('booking.continue') : t('booking.checkAvailability')}
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            
            {showPopup && (
                <PopUp
                    show={showPopup}
                    closeAlert={() => {
                        setShowPopup(false);
                        dispatch(resetBookingOperation());
                        dispatch(resetCalculation());
                    }}
                    msg={popupMessage}
                    type={popupType}
                    autoClose={popupType === 'success'}
                    showConfirmButton={true}
                />
            )}
        </>
    );
};

export default BookingSelection;