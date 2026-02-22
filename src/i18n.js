import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";

const resources = {
  en: { translation: translationEN },
  de: { translation: translationDE },
};
const Locallang = localStorage.getItem("lang")?.toLocaleLowerCase();
i18n
  //.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: (Locallang == "ar" ? "de" : Locallang) || "de",
    lng: (Locallang == "ar" ? "de" : Locallang) || "de",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
