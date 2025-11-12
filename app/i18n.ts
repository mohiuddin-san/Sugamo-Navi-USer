import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Prevent multiple init
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        ja: {
          translation: {
            welcome: "私のアプリへようこそ",
            title: "素晴らしいプロジェクト",

            // Menu Items
            "menu.eat": "食べる",
            "menu.see_do": "観る・遊ぶ",
            "menu.model_courses": "モデルコース",
            "menu.travel_info": "旅の情報",
            "menu.recommended_shops": "おすすめの店",
            "menu.bookmarks": "ブックマーク",
          },
        },
        en: {
          translation: {
            welcome: "Welcome to my app",
            title: "My Awesome Project",

            // Menu Items
            "menu.eat": "Eat",
            "menu.see_do": "See & Do",
            "menu.model_courses": "Model Courses",
            "menu.travel_info": "Travel Info",
            "menu.recommended_shops": "Recommended Shops",
            "menu.bookmarks": "Bookmarks",
          }
        },
      },
      fallbackLng: "ja",
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
      },
    });
}

export default i18n;