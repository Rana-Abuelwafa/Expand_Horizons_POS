import { useState, useEffect } from "react";
import { Card, Button, Carousel } from "react-bootstrap";
import { FaCheck, FaHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const TourCard = ({ trip }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const currentLang = localStorage.getItem("i18nextLng") || "en";
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);

  // Check if description needs truncation
  useEffect(() => {
    if (trip?.trip_description && trip.trip_description.length > 70) {
      setNeedsTruncation(true);
    }
  }, [trip?.trip_description]);

  // Get truncated text
  const truncatedText = needsTruncation
    ? trip?.trip_description?.slice(0, 70) + "..."
    : trip?.trip_description;

  const handleCardClick = () => {
    console.log("click");
    // if (!trip.is_comm_soon) {
    //   navigate(`/trip/${trip.route}`, {
    //     state: {
    //       tripId: trip?.trip_id,
    //       trip_type: trip?.trip_type,
    //     },
    //   });
    // } else {
    //   navigate("/trip/ComingSoon", {
    //     state: {
    //       tripId: trip.trip_id,
    //       trip_type: trip.trip_type,
    //     },
    //   });
    // }
  };

  // Function to format price display based on trip type
  const renderPrice = () => {
    const currencySymbol =
      trip?.currency_code.toUpperCase() === "EUR" ? "€" : trip?.currency_code;

    return (
      <div className="price-section">
        <div className="price-range">
          <span className="price-label">
            {t("general.from")}{" "}
            <span className="price">
              {" "}
              {trip?.trip_min_price} {currencySymbol}
            </span>{" "}
          </span>
        </div>
        {/* <div className="price-range">
          <span className="price-label">{t("general.to")}  <span className="price"> {trip?.trip_max_price} {currencySymbol}</span> </span>
        </div> */}
      </div>
    );
  };

  return (
    <Card className="tour-card h-100">
      {/* <div className="card-img-container">
        <Card.Img variant="top" src={trip?.default_img} alt={trip?.trip_name} />
      </div> */}
      <div className="card-img-container">
        {trip?.imgs?.length > 1 ? (
          <Carousel
            fade
            touch={true} // enable swipe
            interval={2500} // auto slide every 2.5s
            pause="hover" // pause when mouse over
            wrap={true} // infinite loop
            indicators={true}
            controls={false}
          >
            {trip.imgs?.map((img) => (
              <Carousel.Item key={img.id}>
                <img
                  className="d-block w-100 tour-slider-img"
                  src={img.img_path}
                  alt={trip.trip_name}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <img
            className="d-block w-100 tour-slider-img"
            src={trip?.default_img}
            alt={trip?.trip_name}
          />
        )}
      </div>
      <Card.Body className="card-content">
        <Card.Title className="tour-title">{trip?.trip_name}</Card.Title>

        {/* Description with truncation */}
        <Card.Text className="tour-description">
          {showFullDescription ? trip?.trip_description : truncatedText}
          {needsTruncation && (
            <button
              className="show-more-btn"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDescription(!showFullDescription);
              }}
            >
              {showFullDescription
                ? t("general.show_less")
                : t("general.show_more")}
            </button>
          )}
        </Card.Text>

        <div className="card-footer-content">
          <Button
            variant="outline-primary"
            className="book-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            {t("general.BookNow")}
          </Button>
          {renderPrice()}
        </div>
      </Card.Body>
    </Card>
  );
};

export default TourCard;
