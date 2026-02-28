import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationDE from "./locales/de/translation.json";
import translationRU from "./locales/ru/translation.json";

const resources = {
  en: { translation: translationEN },
  de: { translation: translationDE },
  ru: { translation: translationRU },
};
const Locallang = localStorage.getItem("i18nextLng")?.toLocaleLowerCase();
i18n
  //.use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: (Locallang == "ar" ? "en" : Locallang) || "en",
    lng: (Locallang == "ar" ? "en" : Locallang) || "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
