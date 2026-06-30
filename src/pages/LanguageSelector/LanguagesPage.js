import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import "./LanguagesPage.scss";
import Header from "../../components/Header/Header";
import { isTokenExpired, getUserData } from "../../utils/auth";
import { fetchLanguages, setLanguages } from "../../redux/Slices/languageSlice";

const LanguagesPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { items: languages, loading } = useSelector((state) => state.language);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // persist language
    localStorage.setItem("lang", lng);
    dispatch(setLanguages(lng));

    const user = getUserData();
    if (user && !isTokenExpired(user.refreshTokenExpiryTime)) {
      navigate("/car-categories");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="language-wrapper">
      <Header />
      <div className="language-card">
        <div className="language-list">
          {loading && <span>Loading...</span>}

          {!loading &&
            languages.map((lang) => (
            <button
              key={lang.id}
              className="language-button"
              onClick={() => changeLanguage(lang.lang_code)}
            >
              <div className="flag-wrapper">
                <img
                  src={lang.lang_flag}
                  alt={lang.lang_name}
                />
              </div>
              <span>{lang.lang_name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagesPage;
