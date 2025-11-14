import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { DeviceProvider } from "~/routes/contexts/DeviceContext";
import { useLocation } from "@remix-run/react";
import { useEffect } from "react";
import "~/styles/app.css";
import { I18nextProvider } from "react-i18next";
import i18n from "~/i18n";
import { getLocale } from "~/i18n.server";

function ViewTransitionOutlet() {
  const location = useLocation();

  useEffect(() => {
    if (!document.startViewTransition) return;

    const transition = document.startViewTransition(() => {});
    return () => {
      transition.finished.then(() => {});
    };
  }, [location]);

  return <Outlet />;
}
export const loader = async ({ request }: { request: Request }) => {
  const locale = await getLocale(request);
  return { locale };
};
export const meta = () => [
  { charset: "utf-8" },
  { title: "Sugamo Navi" },
  { name: "viewport", content: "width=device-width, initial-scale=1" },
];
export const links = () => [
  { rel: "icon", href: "/favicon-v2.ico" },
];

export default function App() {

  return (
    <html lang="jp">
      <head>
        <meta name="google-site-verification" content="9CLFMsHmfETMAJ4uw926BzK1qBqLEapvtLvsmvVwSgA" />
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          {/* DeviceProvider ভিতরে */}
          <DeviceProvider>
            <main>
              <ViewTransitionOutlet />
            </main>
          </DeviceProvider>
        </I18nextProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
