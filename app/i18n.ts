// app/i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to my app",
      title: "My Awesome Project",
      "menu.eat": "Eat",
      "menu.see_do": "See & Do",
      "menu.model_courses": "Model Courses",
      "menu.travel_info": "Travel Info",
      "menu.recommended_shops": "Recommended Shops",
      "menu.bookmarks": "Bookmarks",
    },
  },
  ja: {
    translation: {
      welcome: "私のアプリへようこそ",
      title: "素晴らしいプロジェクト",
      "menu.eat": "食べる",
      "menu.see_do": "観る・遊ぶ",
      "menu.model_courses": "モデルコース",
      "menu.travel_info": "旅の情報",
      "menu.recommended_shops": "おすすめの店",
      "menu.bookmarks": "ブックマーク",
    },
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "ja",
      lng: "ja",
      interpolation: { escapeValue: false },
      detection: {
        order: ["querystring", "cookie", "localStorage", "navigator"],
        caches: ["cookie"],
      },
    });
}

export default i18n;