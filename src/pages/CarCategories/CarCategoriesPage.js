import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../../components/Header/Header";
import "./CarCategoriesPage.scss";

const CarCategoriesPage = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const carCategories = [
    {
      id: 1,
      nameKey: "limousine", // Use key instead of display name
      image: "/images/standard-car.jpg",
      tripType: 2,
    },
    {
      id: 2,
      nameKey: "shuttle_bus", // Use key instead of display name
      image: "/images/luxury-car.jpg",
      tripType: 2,
    },
  ];

  const handleCategorySelect = (tripType, vehicle_id) => {
    console.log("vehicle_id ", vehicle_id);
    localStorage.setItem("horizon_pos_vehicle_id", vehicle_id);
    navigate("/Destinations", {
      state: {
        tripType: tripType,
      },
    });
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
                    alt={t(`vehicles.${category.nameKey}`)}
                    className="category-image"
                    loading="lazy"
                  />
                  <div className="card-overlay">
                    <span className="card-badge">
                      {t(`vehicles.${category.nameKey}`)}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCategoriesPage;
