import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LogoSection from "../../components/logoSection/LogoSection";
import "./LanguagesPage.scss";


const LanguagesPage = () => {

const navigate = useNavigate();
  const { i18n } = useTranslation();

  const languages = [
    { name: "English", flag: "../images/gb.png", code: "en" },
    { name: "Deutsch", flag: "../images/de.png" , code: "de" }
  ];

   const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng); // persist language
    navigate("/home"); // go to categories page
  };

  return (
    <div className="language-wrapper">
      <div className="language-card">
        <LogoSection />

        <div className="language-list">
          {languages.map((lang, index) => (
            <button
              key={index}
              className="language-button"
              onClick={() => changeLanguage(lang.code)}
            >
              <div className="flag-wrapper">
                <img src={lang.flag} alt={lang.name} />
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