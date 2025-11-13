// app/AppContent.tsx
import { DeviceProvider } from "~/routes/contexts/DeviceContext";
import { Outlet, useLocation } from "@remix-run/react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getLocale } from "~/i18n.server";

function ViewTransitionOutlet() {
  const location = useLocation();
  useEffect(() => {
    if (!document.startViewTransition) return;
    document.startViewTransition(() => {});
  }, [location]);
  return <Outlet />;
}

export default function AppContent() {
  const { i18n: clientI18n } = useTranslation();

 useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.tiktok.com/embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const updateLang = async () => {
      const response = await fetch("/api/locale");
      const { locale } = await response.json();
      clientI18n.changeLanguage(locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = clientI18n.dir(locale);
      document.documentElement.classList.remove("font-ja", "font-en", "font-zh");
      document.documentElement.classList.add(`font-${locale}`);
    };
    updateLang();
  }, [clientI18n]);

  return (
    <DeviceProvider>
      <main>
        <ViewTransitionOutlet />
      </main>
    </DeviceProvider>
  );
}