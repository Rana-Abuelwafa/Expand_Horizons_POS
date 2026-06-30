import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import { fetchTransferCategories } from "../../redux/Slices/transferCategoriesSlice";
import "./CarCategoriesPage.scss";

const CarCategoriesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    items: carCategories,
    loading,
    error,
  } = useSelector((state) => state.transferCategories);

  useEffect(() => {
    dispatch(fetchTransferCategories());
  }, [dispatch]);

  const handleCategorySelect = (tripType, category) => {
    console.log("vehicle_id ", category);
    localStorage.setItem("horizon_pos_vehicle_id", category?.id);
    localStorage.setItem("horizon_pos_vehicle_name", category?.category_name);
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
            {loading && <p>Loading...</p>}

            {!loading && error && <p>Failed to load categories.</p>}

            {!loading &&
              !error &&
              carCategories.map((category) => (
                <button
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategorySelect(2, category)}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={category.default_img}
                      alt={category.category_name}
                      className="category-image"
                      loading="lazy"
                    />
                    <div className="card-overlay">
                      <span className="card-badge">
                        {category.category_name}
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
