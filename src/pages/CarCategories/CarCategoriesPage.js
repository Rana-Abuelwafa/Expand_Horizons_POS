import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header/Header";
import "./CarCategoriesPage.scss";

const CarCategoriesPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const carCategories = [
    {
      id: 1,
      name: "Standard Car",
      title: "STANDARD",
      description:
        "Economy & Comfort - Perfect for daily travel and business trips",
      image: "/images/standard-car.jpg",
      bgColor: "#fff",
      tripType: 2,
      features: ["4 Passengers", "2 Luggage", "AC", "GPS Navigation"],
    },
    {
      id: 2,
      name: "Luxury Car",
      title: "LUXURY",
      description:
        "Premium & Elegance - First class experience with premium comfort",
      image: "/images/luxury-car.jpg",
      bgColor: "#fff",
      tripType: 2,
      features: ["4 Passengers", "3 Luggage", "Leather Seats", "WiFi", "Water"],
    },
  ];

  const handleCategorySelect = (tripType, vehicle_id) => {
    localStorage.setItem("horizon_pos_vehicle_id", vehicle_id);
    navigate("/Destinations", {
      state: {
        tripType: tripType,
      },
    });
    // navigate('/Transfers', {
    //   state: {
    //     tripType: tripType
    //   }
    // });
  };

  return (
    <div className="car-categories-wrapper">
      <Header />
      <div className="car-categories-content">
        <div className="car-categories-container">
          <div className="categories-header">
            <h1 className="categories-title">
              {t("tours.Choose_your_vehicle")}
            </h1>
            {/* <p className="categories-subtitle">Select the perfect ride for your journey</p> */}
          </div>

          <div className="categories-list">
            {carCategories.map((category) => (
              <button
                key={category.id}
                className="category-card"
                onClick={() =>
                  handleCategorySelect(category.tripType, category.id)
                }
              >
                <div className="card-image-wrapper">
                  <img
                    src={process.env.PUBLIC_URL + category.image}
                    alt={category.name}
                    className="category-image"
                    loading="lazy"
                  />
                  <div className="card-overlay">
                    <span className="card-badge">{category.name}</span>
                  </div>
                </div>
                {/* <div className="card-content">
                  <div className="card-header">
                    <h2 className="card-title">{category.title}</h2>
                    <div className="card-arrow">
                      <span>Select Vehicle</span>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                  <p className="card-description">{category.description}</p>
                  <div className="card-features">
                    {category.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div> */}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCategoriesPage;
