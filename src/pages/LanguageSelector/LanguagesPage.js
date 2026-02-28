import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoSection from "../../components/logoSection/LogoSection";
import "./LanguagesPage.scss";
import Header from "../../components/Header/Header";

const LanguagesPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const languages = [
    { name: "English", flag: "/images/gb.png", code: "en" },
    { name: "Deutsch", flag: "/images/de.png", code: "de" },
    { name: "Русский", flag: "/images/ru.png", code: "ru" }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // persist language
    localStorage.setItem("lang", lng);
    navigate("/home"); // go to categories page
  };

  return (
    <div className="language-wrapper">
      <div className="language-card">
        <Header />

        <div className="language-list">
          {languages.map((lang, index) => (
            <button
              key={index}
              className="language-button"
              onClick={() => changeLanguage(lang.code)}
            >
              <div className="flag-wrapper">
                <img src={process.env.PUBLIC_URL + lang.flag} alt={lang.name} />
              </div>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguagesPage;
