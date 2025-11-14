// app/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// app/i18n.ts
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ["en", "ja", "zh"],
    fallbackLng: "ja",
    lng: "ja", // প্রথমবার
    detection: {
      order: ["cookie", "localStorage", "navigator"], // Cookie প্রথমে
      caches: ["cookie"], // শুধু cookie
      lookupCookie: "i18next",
    },
    // ...
  });

export default i18n;